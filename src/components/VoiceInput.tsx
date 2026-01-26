import { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export const VoiceInput = ({ onTranscript, disabled }: VoiceInputProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Language code mapping for Web Speech API
  const getLanguageCode = (lang: string) => {
    const codes: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      te: 'te-IN',
    };
    return codes[lang] || 'en-IN';
  };

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLanguageCode(language);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const results = event.results;
      let transcript = '';
      
      for (let i = 0; i < results.length; i++) {
        transcript += results[i][0].transcript;
      }
      
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      
      if (event.error === 'not-allowed') {
        toast({
          title: language === 'hi' ? 'माइक्रोफ़ोन की आवश्यकता है' : language === 'te' ? 'మైక్రోఫోన్ అవసరం' : 'Microphone Required',
          description: language === 'hi' ? 'कृपया माइक्रोफ़ोन की अनुमति दें' : language === 'te' ? 'దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి' : 'Please allow microphone access to use voice input',
          variant: 'destructive',
        });
      } else if (event.error === 'no-speech') {
        toast({
          title: language === 'hi' ? 'कोई आवाज़ नहीं मिली' : language === 'te' ? 'ఏ ధ్వని కనుగొనబడలేదు' : 'No speech detected',
          description: language === 'hi' ? 'कृपया फिर से बोलें' : language === 'te' ? 'దయచేసి మళ్ళీ చెప్పండి' : 'Please try speaking again',
          variant: 'default',
        });
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, onTranscript, toast]);

  // Update language when it changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLanguageCode(language);
    }
  }, [language]);

  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast({
          title: language === 'hi' ? 'त्रुटि' : language === 'te' ? 'లోపం' : 'Error',
          description: language === 'hi' ? 'वॉइस इनपुट शुरू करने में विफल' : language === 'te' ? 'వాయిస్ ఇన్‌పుట్ ప్రారంభించడంలో విఫలమైంది' : 'Failed to start voice input',
          variant: 'destructive',
        });
      }
    }
  }, [isRecording, language, toast]);

  if (!isSupported) {
    return null; // Hide button if not supported
  }

  return (
    <Button
      onClick={toggleRecording}
      disabled={disabled}
      size="icon"
      variant={isRecording ? 'destructive' : 'outline'}
      className={`relative ${isRecording ? 'animate-pulse' : ''}`}
      title={isRecording ? t('voice.stop') : t('voice.start')}
    >
      {isRecording ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      {isRecording && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-ping" />
      )}
    </Button>
  );
};
