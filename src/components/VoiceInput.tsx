import { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInput = ({ onTranscript, disabled }: VoiceInputProps) => {
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Language code mapping for ElevenLabs
  const getLanguageCode = (lang: string) => {
    const codes: Record<string, string> = {
      en: 'eng',
      hi: 'hin',
      te: 'tel',
    };
    return codes[lang] || 'eng';
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  }, []);

  const transcribeAudio = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', getLanguageCode(language));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-transcribe`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      if (data.text && data.text.trim()) {
        onTranscript(data.text.trim());
      } else {
        toast({
          title: language === 'hi' ? 'कोई आवाज़ नहीं मिली' : language === 'te' ? 'ఏ ధ్వని కనుగొనబడలేదు' : 'No speech detected',
          description: language === 'hi' ? 'कृपया फिर से बोलें' : language === 'te' ? 'దయచేసి మళ్ళీ చెప్పండి' : 'Please try speaking again',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'te' ? 'లోపం' : 'Error',
        description: language === 'hi' ? 'आवाज़ को टेक्स्ट में बदलने में विफल' : language === 'te' ? 'ధ్వనిని టెక్స్ట్‌గా మార్చడంలో విఫలమైంది' : 'Failed to convert speech to text',
        variant: 'destructive',
      });
    }
  }, [language, onTranscript, toast]);

  const startRecording = useCallback(async () => {
    try {
      setIsConnecting(true);
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      chunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { 
          type: mediaRecorder.mimeType 
        });
        
        if (audioBlob.size > 0) {
          await transcribeAudio(audioBlob);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsConnecting(false);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 30000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsConnecting(false);
      toast({
        title: language === 'hi' ? 'माइक्रोफ़ोन की आवश्यकता है' : language === 'te' ? 'మైక్రోఫోన్ అవసరం' : 'Microphone Required',
        description: language === 'hi' ? 'कृपया माइक्रोफ़ोन की अनुमति दें' : language === 'te' ? 'దయచేసి మైక్రోఫోన్ అనుమతి ఇవ్వండి' : 'Please allow microphone access to use voice input',
        variant: 'destructive',
      });
    }
  }, [language, stopRecording, transcribeAudio, toast]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Button
      onClick={toggleRecording}
      disabled={disabled || isConnecting}
      size="icon"
      variant={isRecording ? 'destructive' : 'outline'}
      className={`relative ${isRecording ? 'animate-pulse' : ''}`}
      title={isRecording ? t('voice.stop') : t('voice.start')}
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
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
