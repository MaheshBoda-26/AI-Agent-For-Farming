import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CropSuggestion {
  name: string;
  name_hi: string;
  reasons: string[];
  risk: string;
  confidence: number;
}

export interface CropSuggestInput {
  state: string;
  district?: string;
  month: number;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  soil_type: string;
  avg_temp?: number;
  rainfall_forecast_mm?: number;
  language?: string;
}

interface UseCropSuggestionResult {
  suggestions: CropSuggestion[];
  isLoading: boolean;
  error: string | null;
  message: string | null;
  getSuggestions: (input: CropSuggestInput) => Promise<void>;
}

export const useCropSuggestion = (): UseCropSuggestionResult => {
  const [suggestions, setSuggestions] = useState<CropSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const getSuggestions = useCallback(async (input: CropSuggestInput) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    setSuggestions([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('crop-suggest', {
        body: input,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.errors?.join(', ') || data.error);
      }

      setSuggestions(data.crops || []);
      setMessage(data.message || null);
    } catch (err) {
      console.error('Crop suggestion error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get suggestions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    suggestions,
    isLoading,
    error,
    message,
    getSuggestions,
  };
};
