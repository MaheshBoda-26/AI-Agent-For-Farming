import { useState, useEffect, useCallback } from 'react';
import { api } from '@/integrations/api';

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

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        () => setCoords(null),
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.post('/functions/get-weather', coords ? { lat: coords.lat, lon: coords.lon } : {});
      if (data.error) throw new Error(data.error);
      setWeather(data);
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather');
    } finally {
      setIsLoading(false);
    }
  }, [coords]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchWeather(); }, 1000);
    return () => clearTimeout(timer);
  }, [fetchWeather]);

  return { weather, isLoading, error, refetch: fetchWeather };
};
