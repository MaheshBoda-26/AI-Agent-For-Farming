import { useLanguage } from '@/contexts/LanguageContext';
import { useWeather } from '@/hooks/useWeather';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Cloud, Sun, CloudRain, Wind, CloudSnow, CloudLightning, 
  CloudFog, AlertTriangle, Droplets, ThermometerSun, ShieldAlert,
  Leaf, Umbrella
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WeatherAlert {
  type: 'warning' | 'info' | 'success';
  icon: LucideIcon;
  title: string;
  message: string;
}

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

const generateAlerts = (
  weather: { current: { condition: string; temp: number; humidity: number; wind: number }; forecast: Array<{ condition: string; temp: number }> },
  language: string
): WeatherAlert[] => {
  const alerts: WeatherAlert[] = [];
  const { current, forecast } = weather;
  const conditionLower = current.condition.toLowerCase();

  // Check for rain/storm in current or upcoming forecast
  const upcomingRain = forecast.some(day => 
    day.condition.toLowerCase().includes('rain') || 
    day.condition.toLowerCase().includes('drizzle')
  );
  const upcomingStorm = forecast.some(day => 
    day.condition.toLowerCase().includes('thunder') || 
    day.condition.toLowerCase().includes('storm')
  );

  // Current rain
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    alerts.push({
      type: 'warning',
      icon: Umbrella,
      title: language === 'hi' ? '🌧️ बारिश चल रही है' : language === 'te' ? '🌧️ వర్షం పడుతోంది' : '🌧️ Rain in Progress',
      message: language === 'hi' 
        ? 'खेत में पानी जमा होने से बचाएं। जल निकासी की जांच करें।'
        : language === 'te'
        ? 'పొలంలో నీరు నిలవకుండా చూడండి. డ్రైనేజీ తనిఖీ చేయండి.'
        : 'Prevent waterlogging in fields. Check drainage systems.',
    });
  }

  // Thunderstorm warning
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    alerts.push({
      type: 'warning',
      icon: ShieldAlert,
      title: language === 'hi' ? '⚡ आंधी तूफान की चेतावनी' : language === 'te' ? '⚡ తుఫాను హెచ్చరిక' : '⚡ Storm Alert',
      message: language === 'hi'
        ? 'सुरक्षित स्थान पर जाएं। पशुओं को अंदर रखें। बिजली के उपकरण बंद करें।'
        : language === 'te'
        ? 'సురక్షితమైన ప్రదేశానికి వెళ్ళండి. పశువులను లోపల ఉంచండి.'
        : 'Seek shelter immediately. Keep livestock indoors. Disconnect electrical equipment.',
    });
  }

  // Upcoming rain in forecast
  if (!conditionLower.includes('rain') && upcomingRain) {
    alerts.push({
      type: 'info',
      icon: CloudRain,
      title: language === 'hi' ? '🌦️ आने वाले दिनों में बारिश' : language === 'te' ? '🌦️ రాబోయే రోజుల్లో వర్షం' : '🌦️ Rain Expected Soon',
      message: language === 'hi'
        ? 'फसल कटाई जल्दी पूरी करें। बीज और उर्वरक सुरक्षित रखें।'
        : language === 'te'
        ? 'పంట కోత త్వరగా పూర్తి చేయండి. విత్తనాలు మరియు ఎరువులు భద్రంగా ఉంచండి.'
        : 'Complete harvesting early. Store seeds and fertilizers safely.',
    });
  }

  // Upcoming storm
  if (upcomingStorm) {
    alerts.push({
      type: 'warning',
      icon: CloudLightning,
      title: language === 'hi' ? '⛈️ तूफान की संभावना' : language === 'te' ? '⛈️ తుఫాను అవకాశం' : '⛈️ Storm Approaching',
      message: language === 'hi'
        ? 'अगले कुछ दिनों में तूफान आ सकता है। फसल और उपकरण सुरक्षित करें।'
        : language === 'te'
        ? 'రాబోయే రోజుల్లో తుఫాను రావచ్చు. పంటలు మరియు పరికరాలను భద్రపరచండి.'
        : 'Storm expected in coming days. Secure crops and equipment.',
    });
  }

  // High wind warning
  if (current.wind > 30) {
    alerts.push({
      type: 'warning',
      icon: Wind,
      title: language === 'hi' ? '💨 तेज हवा' : language === 'te' ? '💨 బలమైన గాలి' : '💨 High Winds',
      message: language === 'hi'
        ? 'स्प्रे न करें। पौधों को सहारा दें। प्लास्टिक कवर सुरक्षित करें।'
        : language === 'te'
        ? 'స్ప్రే చేయవద్దు. మొక్కలకు ఆధారం ఇవ్వండి.'
        : 'Avoid spraying pesticides. Support tall plants. Secure plastic covers.',
    });
  }

  // High temperature
  if (current.temp > 38) {
    alerts.push({
      type: 'warning',
      icon: ThermometerSun,
      title: language === 'hi' ? '🌡️ अत्यधिक गर्मी' : language === 'te' ? '🌡️ తీవ్రమైన వేడి' : '🌡️ Extreme Heat',
      message: language === 'hi'
        ? 'सुबह/शाम सिंचाई करें। पशुओं को छाया और पानी दें।'
        : language === 'te'
        ? 'ఉదయం/సాయంత్రం నీరు పెట్టండి. పశువులకు నీడ మరియు నీరు ఇవ్వండి.'
        : 'Irrigate in morning/evening only. Provide shade and water to livestock.',
    });
  }

  // High humidity - disease risk
  if (current.humidity > 80) {
    alerts.push({
      type: 'info',
      icon: Droplets,
      title: language === 'hi' ? '💧 उच्च आर्द्रता' : language === 'te' ? '💧 అధిక తేమ' : '💧 High Humidity',
      message: language === 'hi'
        ? 'फंगल रोगों का खतरा। फसल की निगरानी करें।'
        : language === 'te'
        ? 'ఫంగల్ వ్యాధుల ప్రమాదం. పంటను పర్యవేక్షించండి.'
        : 'Fungal disease risk high. Monitor crops closely.',
    });
  }

  // Good weather for farming
  if (alerts.length === 0 && (conditionLower.includes('clear') || conditionLower.includes('sunny'))) {
    alerts.push({
      type: 'success',
      icon: Leaf,
      title: language === 'hi' ? '☀️ खेती के लिए अच्छा मौसम' : language === 'te' ? '☀️ వ్యవసాయానికి మంచి వాతావరణం' : '☀️ Good Farming Weather',
      message: language === 'hi'
        ? 'बुवाई, छिड़काव और कटाई के लिए आदर्श स्थिति।'
        : language === 'te'
        ? 'విత్తడం, స్ప్రే చేయడం మరియు కోయడం కోసం అనువైన పరిస్థితి.'
        : 'Ideal conditions for sowing, spraying, and harvesting.',
    });
  }

  return alerts.slice(0, 2); // Show max 2 alerts
};

export const WeatherAlertWidget = () => {
  const { language } = useLanguage();
  const { weather, isLoading, error } = useWeather();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-chart-3/10 to-chart-4/10 border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return null; // Don't show anything if weather fails
  }

  const CurrentIcon = getWeatherIcon(weather.current.condition);
  const alerts = generateAlerts(weather, language);

  const getAlertStyles = (type: WeatherAlert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'success':
        return 'bg-chart-2/10 border-chart-2/30 text-chart-2';
      default:
        return 'bg-chart-4/10 border-chart-4/30 text-chart-4';
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary/5 via-chart-3/5 to-chart-4/5 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
          {/* Current Weather Summary */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrentIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">{weather.current.temp}°C</span>
                <span className="text-sm text-muted-foreground capitalize">{weather.current.description}</span>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span>{weather.location}</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {weather.current.humidity}%
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  {weather.current.wind} km/h
                </span>
              </p>
            </div>
          </div>

          {/* Alerts */}
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            {alerts.map((alert, index) => {
              const AlertIcon = alert.icon;
              return (
                <Alert 
                  key={index} 
                  className={`py-2 px-3 flex-1 ${getAlertStyles(alert.type)}`}
                >
                  <AlertIcon className="h-4 w-4" />
                  <div className="ml-2">
                    <AlertTitle className="text-sm font-medium leading-tight">{alert.title}</AlertTitle>
                    <AlertDescription className="text-xs mt-0.5 opacity-90">
                      {alert.message}
                    </AlertDescription>
                  </div>
                </Alert>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
