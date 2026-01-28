import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PestAdvisoryInput {
  crop_name: string;
  growth_stage: string;
  symptoms_text: string;
  image_base64?: string;
  language?: string;
}

export interface OtherCandidate {
  pest_name: string;
  confidence: number;
  matched_symptoms?: string[];
}

export interface PestAdvisoryResult {
  pest_name: string | null;
  pest_name_local?: string;
  confidence: number;
  pest_type?: string;
  reasons: string[];
  actions: string[];
  prevention: string[];
  risk_note: string;
  follow_up?: string;
  message?: string;
  other_candidates?: OtherCandidate[];
}

interface UsePestAdvisoryReturn {
  result: PestAdvisoryResult | null;
  isLoading: boolean;
  error: string | null;
  getAdvisory: (input: PestAdvisoryInput) => Promise<void>;
  reset: () => void;
}

export const usePestAdvisory = (): UsePestAdvisoryReturn => {
  const [result, setResult] = useState<PestAdvisoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvisory = useCallback(async (input: PestAdvisoryInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('pest-advisory', {
        body: input,
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data as PestAdvisoryResult);
    } catch (err) {
      console.error('Pest advisory error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get pest advisory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    result,
    isLoading,
    error,
    getAdvisory,
    reset,
  };
};
