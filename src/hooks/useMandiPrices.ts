import { useState, useCallback } from 'react';
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
}

export function useMandiPrices() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MandiPricesResponse | null>(null);

  const fetchPrices = useCallback(async (crop?: string, state?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (crop) params.set('crop', crop);
      if (state) params.set('state', state);

      const { data: response, error: fnError } = await supabase.functions.invoke(
        'mandi-prices',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: null,
        }
      );

      // Handle function invocation with query params
      const queryString = params.toString();
      const functionUrl = `mandi-prices${queryString ? `?${queryString}` : ''}`;
      
      const { data: pricesData, error: pricesError } = await supabase.functions.invoke(
        functionUrl.split('?')[0],
        {
          method: 'GET',
        }
      );

      if (pricesError) {
        throw new Error(pricesError.message);
      }

      if (!pricesData?.success) {
        throw new Error(pricesData?.error || 'Failed to fetch prices');
      }

      // Apply filters client-side since edge function GET doesn't support body
      let filteredData = { ...pricesData.data };
      if (crop) {
        filteredData.prices = filteredData.prices.filter((p: MandiPrice) => p.crop_name === crop);
        // Find trend for selected crop
        const allTrends = await fetchAllTrends();
        filteredData.trend = allTrends.find((t: CropTrend) => t.crop_name === crop) || null;
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

  const fetchAllTrends = async (): Promise<CropTrend[]> => {
    // This would be a separate endpoint in production
    // For now, we'll return from the main endpoint
    try {
      const { data: response } = await supabase.functions.invoke('mandi-prices');
      return response?.data?.trends || [];
    } catch {
      return [];
    }
  };

  return {
    isLoading,
    error,
    data,
    fetchPrices,
  };
}
