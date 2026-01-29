import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCropSuggestion, CropSuggestInput } from '@/hooks/useCropSuggestion';
import { useWeather } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Leaf, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { INDIAN_STATES_DATA, SOIL_TYPES_DATA, getCurrentSeason, getSeasonName } from '@/data/crops';

interface CropSuggestionFormProps {
  onSuggestionComplete?: (summary: string) => void;
}

export const CropSuggestionForm = ({ onSuggestionComplete }: CropSuggestionFormProps) => {
  const { t, language } = useLanguage();
  const { weather } = useWeather();
  const { suggestions, isLoading, error, message, getSuggestions } = useCropSuggestion();

  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = getCurrentSeason(currentMonth);

  const [formData, setFormData] = useState({
    state: '',
    soil_type: '',
    season: currentSeason,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.state || !formData.soil_type) {
      return;
    }

    const input: CropSuggestInput = {
      state: formData.state,
      month: currentMonth,
      season: formData.season as 'Kharif' | 'Rabi' | 'Zaid',
      soil_type: formData.soil_type,
      language,
      avg_temp: weather?.current?.temp,
      rainfall_forecast_mm: undefined, // Could be enhanced with weather forecast
    };

    await getSuggestions(input);
  };

  // Generate summary for chat integration
  const getSummaryText = (): string => {
    if (suggestions.length === 0) return '';
    
    const cropNames = suggestions.map(s => language === 'hi' ? s.name_hi : s.name).join(', ');
    return language === 'hi' 
      ? `आपके लिए सुझाई गई फसलें: ${cropNames}`
      : language === 'te'
      ? `మీ కోసం సిఫార్సు చేసిన పంటలు: ${cropNames}`
      : `Recommended crops for you: ${cropNames}`;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-100 dark:bg-green-900/30';
    if (confidence >= 60) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-orange-100 dark:bg-orange-900/30';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Leaf className="h-5 w-5 text-primary" />
            {t('crop.suggest.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* State Selection */}
              <div className="space-y-2">
                <Label htmlFor="state">
                  {t('crop.suggest.state')}
                </Label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder={t('crop.suggest.selectState')} />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES_DATA.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state[language as 'en' | 'hi' | 'te'] || state.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Soil Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="soil">
                  {t('crop.suggest.soil')}
                </Label>
                <Select
                  value={formData.soil_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, soil_type: value }))}
                >
                  <SelectTrigger id="soil">
                    <SelectValue placeholder={t('crop.suggest.selectSoil')} />
                  </SelectTrigger>
                  <SelectContent>
                    {SOIL_TYPES_DATA.map((soil) => (
                      <SelectItem key={soil.value} value={soil.value}>
                        {soil[language as 'en' | 'hi' | 'te'] || soil.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Season Selection */}
              <div className="space-y-2">
                <Label htmlFor="season">
                  {t('crop.suggest.season')}
                </Label>
                <Select
                  value={formData.season}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, season: value as typeof currentSeason }))}
                >
                  <SelectTrigger id="season">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kharif">{getSeasonName('Kharif', language)}</SelectItem>
                    <SelectItem value="Rabi">{getSeasonName('Rabi', language)}</SelectItem>
                    <SelectItem value="Zaid">{getSeasonName('Zaid', language)}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weather Info (if available) */}
            {weather?.current && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                <Info className="h-4 w-4" />
                <span>
                  {t('crop.suggest.currentTemp')}: {weather.current.temp}°C | {weather.current.condition}
                </span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading || !formData.state || !formData.soil_type}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('crop.suggest.analyzing')}
                </>
              ) : (
                t('crop.suggest.button')
              )}
            </Button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* No Results Message */}
          {message && suggestions.length === 0 && (
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <Info className="h-4 w-4" />
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Results */}
          {suggestions.length > 0 && (
            <div className="mt-4 space-y-3">
              <h4 className="font-semibold text-foreground">
                {t('crop.suggest.results')}
              </h4>
              
              {suggestions.map((crop, index) => (
                <Card key={crop.name} className={`${getConfidenceBg(crop.confidence)} border-0`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-semibold">
                            #{index + 1} {language === 'hi' ? crop.name_hi : crop.name}
                          </span>
                          <span className={`text-sm font-medium ${getConfidenceColor(crop.confidence)}`}>
                            {crop.confidence}% {t('crop.suggest.suitable')}
                          </span>
                        </div>
                        
                        {/* Reasons */}
                        <ul className="space-y-1 mb-2">
                          {crop.reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                              <span>{reason}</span>
                            </li>
                          ))}
                        </ul>
                        
                        {/* Risk */}
                        <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
                          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>{crop.risk}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Ask in Chat Button */}
              {onSuggestionComplete && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSuggestionComplete(getSummaryText())}
                >
                  {t('crop.suggest.ask')}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};