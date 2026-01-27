import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MandiPrice {
  crop_name: string;
  crop_name_hi: string;
  state: string;
  mandi: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  date: string;
  trend: 'up' | 'down' | 'stable';
  trend_percent: number;
}

export interface CropTrend {
  crop_name: string;
  crop_name_hi: string;
  prices: { date: string; price: number }[];
  best_selling_month: string;
  best_selling_month_hi: string;
  peak_price: number;
  current_price: number;
  recommendation: string;
  recommendation_hi: string;
}

export interface MandiPricesResponse {
  prices: MandiPrice[];
  trend: CropTrend | null;
  filters: {
    crops: string[];
    states: string[];
  };
  last_updated: string;
  is_live_data: boolean;
}

export function useMandiPrices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MandiPricesResponse | null>(null);

  const fetchPrices = useCallback(async (crop?: string, state?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (crop) params.set('crop', crop);
      if (state) params.set('state', state);

      // Supabase edge function invocation
      const { data: response, error: fnError } = await supabase.functions.invoke(
        'mandi-prices',
        {
          method: 'GET',
        }
      );

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to fetch prices');
      }

      // Apply client-side filters since edge function returns all data
      let filteredData = { ...response.data };
      
      if (crop) {
        filteredData.prices = filteredData.prices.filter((p: MandiPrice) => p.crop_name === crop);
      }
      if (state) {
        filteredData.prices = filteredData.prices.filter((p: MandiPrice) => p.state === state);
      }

      setData(filteredData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch prices';
      setError(message);
      console.error('Mandi prices error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  return {
    isLoading,
    error,
    data,
    fetchPrices,
    refetch: () => fetchPrices(),
  };
}
