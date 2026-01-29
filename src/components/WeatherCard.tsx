import { useLanguage } from '@/contexts/LanguageContext';
import { useWeather } from '@/hooks/useWeather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Cloud, Sun, CloudRain, Wind, CloudSnow, CloudLightning, CloudFog, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

const getWeatherIcon = (condition: string): LucideIcon => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return Sun;
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return CloudRain;
  if (conditionLower.includes('snow')) return CloudSnow;
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) return CloudLightning;
  if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) return CloudFog;
  if (conditionLower.includes('cloud')) return Cloud;
  return Sun;
};

export const WeatherCard = () => {
  const { t } = useLanguage();
  const { weather, isLoading, error, refetch } = useWeather();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-chart-3/20 to-chart-1/10 border-chart-3/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-10 w-20 mb-1" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <Skeleton className="h-4 w-20 mb-3" />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-3 w-8 mb-1 mx-auto" />
                  <Skeleton className="h-5 w-5 mx-auto mb-1" />
                  <Skeleton className="h-4 w-6 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="bg-gradient-to-br from-chart-3/20 to-chart-1/10 border-chart-3/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">{t('weather.today')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm mb-3">
              {error || t('weather.error')}
            </p>
            <Button variant="outline" size="sm" onClick={refetch}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('common.retry')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const CurrentIcon = getWeatherIcon(weather.current.condition);

  return (
    <Card className="bg-gradient-to-br from-chart-3/20 to-chart-1/10 border-chart-3/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{t('weather.today')}</span>
          <span className="text-sm font-normal text-muted-foreground">{weather.location}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <CurrentIcon className="h-12 w-12 text-chart-4" />
          <div>
            <p className="text-4xl font-bold text-foreground">{weather.current.temp}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{weather.current.description}</p>
          </div>
          <div className="ml-auto text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Cloud className="h-4 w-4" />
              <span>{weather.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
              <span>{weather.current.wind} km/h</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium mb-3">{t('weather.forecast')}</p>
          <div className="flex justify-between">
            {weather.forecast.map((day, index) => {
              const DayIcon = getWeatherIcon(day.condition);
              return (
                <div key={index} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                  <DayIcon className="h-5 w-5 mx-auto text-chart-3" />
                  <p className="text-sm font-medium mt-1">{day.temp}°</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
