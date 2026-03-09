import { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2, X, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface VoiceAssistantProps {
  onClose: () => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

// Reuse Web Speech API types from global declarations in VoiceInput.tsx

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-farming`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;

export const VoiceAssistant = ({ onClose }: VoiceAssistantProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getLanguageCode = (lang: string) => {
    const codes: Record<string, string> = { en: 'en-IN', hi: 'hi-IN', te: 'te-IN' };
    return codes[lang] || 'en-IN';
  };

  const labels: Record<string, Record<VoiceState, string>> = {
    en: { idle: 'Tap to speak', listening: 'Listening...', processing: 'Thinking...', speaking: 'Speaking...' },
    hi: { idle: 'बोलने के लिए टैप करें', listening: 'सुन रहा हूँ...', processing: 'सोच रहा हूँ...', speaking: 'बोल रहा हूँ...' },
    te: { idle: 'మాట్లాడటానికి నొక్కండి', listening: 'వింటున్నాను...', processing: 'ఆలోచిస్తున్నాను...', speaking: 'చెప్తున్నాను...' },
  };

  // Strip markdown for TTS
  const stripMarkdown = (text: string) => {
    return text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[-*+]\s/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, '. ')
      .trim();
  };

  const speakResponse = useCallback(async (text: string) => {
    setState('speaking');
    const cleanText = stripMarkdown(text);
    
    // Limit to first ~500 chars for TTS to keep response quick
    const ttsText = cleanText.length > 500 ? cleanText.substring(0, 500) + '...' : cleanText;

    try {
      const resp = await fetch(TTS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: ttsText, language }),
      });

      if (!resp.ok) throw new Error('TTS failed');

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState('idle');
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        setState('idle');
      };

      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setState('idle');
      // Fallback to browser TTS
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 300));
        utterance.lang = getLanguageCode(language);
        utterance.onend = () => setState('idle');
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [language]);

  const getAIResponse = useCallback(async (userText: string) => {
    setState('processing');
    setResponse('');

    const newHistory = [...conversationHistory, { role: 'user', content: userText }];

    try {
      abortRef.current = new AbortController();
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newHistory,
          language,
          location: 'India',
        }),
        signal: abortRef.current.signal,
      });

      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      if (!resp.body) throw new Error('No response body');

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              setResponse(fullResponse);
            }
          } catch { /* partial json */ }
        }
      }

      const updatedHistory = [...newHistory, { role: 'assistant', content: fullResponse }];
      setConversationHistory(updatedHistory);

      // Speak the response
      if (fullResponse) {
        await speakResponse(fullResponse);
      } else {
        setState('idle');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('AI error:', err);
      setState('idle');
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  }, [conversationHistory, language, speakResponse, toast]);

  const startListening = useCallback(() => {
    // Stop any playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast({ title: 'Not Supported', description: 'Voice input is not supported in this browser', variant: 'destructive' });
      return;
    }

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getLanguageCode(language);

    recognition.onstart = () => {
      setState('listening');
      setTranscript('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    recognition.onend = () => {
      const currentTranscript = transcript;
      // Use a small timeout to get final transcript from state
      setTimeout(() => {
        const el = document.getElementById('voice-transcript');
        const text = el?.textContent || '';
        if (text.trim()) {
          getAIResponse(text.trim());
        } else {
          setState('idle');
        }
      }, 100);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setState('idle');
      if (event.error === 'not-allowed') {
        toast({ title: 'Microphone Required', description: 'Please allow microphone access', variant: 'destructive' });
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [language, toast, getAIResponse, transcript]);

  const stopAll = useCallback(() => {
    recognitionRef.current?.abort();
    audioRef.current?.pause();
    abortRef.current?.abort();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setState('idle');
    setTranscript('');
    setResponse('');
  }, []);

  const handleMainButton = useCallback(() => {
    if (state === 'idle') {
      startListening();
    } else if (state === 'listening') {
      recognitionRef.current?.stop();
    } else if (state === 'speaking') {
      audioRef.current?.pause();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setState('idle');
    }
  }, [state, startListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      audioRef.current?.pause();
      abortRef.current?.abort();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const stateLabel = labels[language]?.[state] || labels.en[state];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 max-w-md w-full px-6">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => { stopAll(); onClose(); }}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Animated orb */}
        <div className="relative">
          <button
            onClick={handleMainButton}
            className={`
              relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-300
              ${state === 'idle' ? 'bg-primary hover:bg-primary/90 scale-100' : ''}
              ${state === 'listening' ? 'bg-destructive scale-110' : ''}
              ${state === 'processing' ? 'bg-muted scale-100' : ''}
              ${state === 'speaking' ? 'bg-primary scale-105' : ''}
            `}
          >
            {state === 'idle' && <Mic className="h-12 w-12 text-primary-foreground" />}
            {state === 'listening' && <MicOff className="h-12 w-12 text-destructive-foreground animate-pulse" />}
            {state === 'processing' && <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />}
            {state === 'speaking' && <AudioLines className="h-12 w-12 text-primary-foreground animate-pulse" />}
          </button>

          {/* Pulse rings */}
          {state === 'listening' && (
            <>
              <span className="absolute inset-0 rounded-full bg-destructive/30 animate-ping" />
              <span className="absolute -inset-3 rounded-full border-2 border-destructive/20 animate-pulse" />
            </>
          )}
          {state === 'speaking' && (
            <span className="absolute -inset-3 rounded-full border-2 border-primary/20 animate-pulse" />
          )}
        </div>

        {/* State label */}
        <p className="text-lg font-medium text-foreground">{stateLabel}</p>

        {/* Transcript display */}
        {transcript && (
          <div className="bg-card rounded-xl p-4 border border-border w-full text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {language === 'hi' ? 'आपने कहा:' : language === 'te' ? 'మీరు చెప్పారు:' : 'You said:'}
            </p>
            <p id="voice-transcript" className="text-foreground font-medium">{transcript}</p>
          </div>
        )}

        {/* Response display */}
        {response && (
          <div className="bg-card rounded-xl p-4 border border-border w-full max-h-48 overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-1">
              {language === 'hi' ? 'सहायक:' : language === 'te' ? 'సహాయకుడు:' : 'Assistant:'}
            </p>
            <p className="text-foreground text-sm whitespace-pre-wrap">{response}</p>
          </div>
        )}

        {/* Hint */}
        {state === 'idle' && !transcript && !response && (
          <p className="text-sm text-muted-foreground text-center">
            {language === 'hi' ? 'अपनी फसलों, मौसम या बाजार के बारे में कुछ भी पूछें' :
             language === 'te' ? 'మీ పంటలు, వాతావరణం లేదా మార్కెట్ గురించి ఏదైనా అడగండి' :
             'Ask anything about your crops, weather, or market prices'}
          </p>
        )}
      </div>
    </div>
  );
};
