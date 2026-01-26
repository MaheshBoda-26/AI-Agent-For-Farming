import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CurrentWeather {
  temp: number;
  condition: string;
  description: string;
  humidity: number;
  wind: number;
  icon: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

interface WeatherData {
  location: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
}

interface UseWeatherResult {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useWeather = (): UseWeatherResult => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  // Get user's location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          console.log('Geolocation error:', err.message);
          // Will use default location (Warangal)
          setCoords(null);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('get-weather', {
        body: coords ? { lat: coords.lat, lon: coords.lon } : {},
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setWeather(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setIsLoading(false);
    }
  }, [coords]);

  // Fetch weather when coords change or on initial mount
  useEffect(() => {
    // Small delay to allow geolocation to complete
    const timer = setTimeout(() => {
      fetchWeather();
    }, 1000);

    return () => clearTimeout(timer);
  }, [fetchWeather]);

  return { weather, isLoading, error, refetch: fetchWeather };
};
