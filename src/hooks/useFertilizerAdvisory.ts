import { useState, useCallback } from 'react';
import { api } from '@/integrations/api';

export interface FertilizerAdvisoryInput {
  crop_name: string;
  growth_stage: string;
  soil_type?: string;
  language?: string;
}

export interface FertilizerAdvisoryResult {
  primary_fertilizers: string[];
  application_method: string;
  timing: string;
  organic_alternatives: string[];
  micronutrients?: string[];
  tips: string[];
  warning: string;
  consult_note: string;
}

interface UseFertilizerAdvisoryReturn {
  result: FertilizerAdvisoryResult | null;
  isLoading: boolean;
  error: string | null;
  getAdvisory: (input: FertilizerAdvisoryInput) => Promise<void>;
  reset: () => void;
}

export const useFertilizerAdvisory = (): UseFertilizerAdvisoryReturn => {
  const [result, setResult] = useState<FertilizerAdvisoryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdvisory = useCallback(async (input: FertilizerAdvisoryInput) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.post('/functions/fertilizer-advisory', input);
      if (data.error) throw new Error(data.error);
      setResult(data as FertilizerAdvisoryResult);
    } catch (err) {
      console.error('Fertilizer advisory error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get fertilizer advisory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setResult(null); setError(null); setIsLoading(false); }, []);

  return { result, isLoading, error, getAdvisory, reset };
};
