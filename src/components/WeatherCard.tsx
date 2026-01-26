import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind } from 'lucide-react';

interface WeatherCardProps {
  location?: string;
}

export const WeatherCard = ({ location = 'Warangal, Telangana' }: WeatherCardProps) => {
  const { t } = useLanguage();

  // Mock weather data - in production this would come from API
  const weatherData = {
    current: {
      temp: 28,
      condition: 'sunny',
      humidity: 65,
      wind: 12,
    },
    forecast: [
      { day: 'Mon', temp: 29, icon: Sun },
      { day: 'Tue', temp: 27, icon: Cloud },
      { day: 'Wed', temp: 25, icon: CloudRain },
      { day: 'Thu', temp: 26, icon: Cloud },
      { day: 'Fri', temp: 28, icon: Sun },
    ],
  };

  return (
    <Card className="bg-gradient-to-br from-chart-3/20 to-chart-1/10 border-chart-3/30">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{t('weather.today')}</span>
          <span className="text-sm font-normal text-muted-foreground">{location}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Sun className="h-12 w-12 text-chart-4" />
          <div>
            <p className="text-4xl font-bold text-foreground">{weatherData.current.temp}°C</p>
            <p className="text-sm text-muted-foreground capitalize">{weatherData.current.condition}</p>
          </div>
          <div className="ml-auto text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Cloud className="h-4 w-4" />
              <span>{weatherData.current.humidity}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
              <span>{weatherData.current.wind} km/h</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium mb-3">{t('weather.forecast')}</p>
          <div className="flex justify-between">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <p className="text-xs text-muted-foreground mb-1">{day.day}</p>
                <day.icon className="h-5 w-5 mx-auto text-chart-3" />
                <p className="text-sm font-medium mt-1">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
