import { useState, useCallback } from 'react';
import { api } from '@/integrations/api';

interface UseCropImageAnalysisResult {
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
  analyzeImage: (imageUrl: string, additionalInfo?: string, language?: string) => Promise<void>;
  reset: () => void;
}

export const useCropImageAnalysis = (): UseCropImageAnalysisResult => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeImage = useCallback(async (imageUrl: string, additionalInfo?: string, language?: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const data = await api.post('/functions/analyze-crop-image', { imageUrl, additionalInfo, language });
      if (data.error) throw new Error(data.error);
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Crop image analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setAnalysis(null); setError(null); setIsLoading(false); }, []);

  return { analysis, isLoading, error, analyzeImage, reset };
};
