import { useState, useCallback, useEffect } from 'react';
import { api } from '@/integrations/api';

export interface MandiPrice {
  crop_name: string;
  crop_name_hi: string;
  crop_name_te?: string;
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
  crop_name_te?: string;
  prices: { date: string; price: number }[];
  best_selling_month: string;
  best_selling_month_hi: string;
  best_selling_month_te?: string;
  peak_price: number;
  current_price: number;
  recommendation: string;
  recommendation_hi: string;
  recommendation_te?: string;
}

export interface MandiPricesResponse {
  prices: MandiPrice[];
  trend: CropTrend | null;
  filters: { crops: string[]; states: string[] };
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
      const response = await api.post('/functions/mandi-prices', { crop, state });
      if (!response?.success) throw new Error(response?.error || 'Failed to fetch prices');

      let filteredData = { ...response.data };
      if (crop) filteredData.prices = filteredData.prices.filter((p: MandiPrice) => p.crop_name === crop);
      if (state) filteredData.prices = filteredData.prices.filter((p: MandiPrice) => p.state === state);

      setData(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  return { isLoading, error, data, fetchPrices, refetch: () => fetchPrices() };
}
