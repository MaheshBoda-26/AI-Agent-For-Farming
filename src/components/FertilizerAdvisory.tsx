import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useFertilizerAdvisory } from '@/hooks/useFertilizerAdvisory';
import { getCropsList, getGrowthStages, getCropName, getGrowthStageName } from '@/data/pestDatabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Leaf, RefreshCw, Loader2, Droplets, FlaskConical, Lightbulb, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FertilizerAdvisoryProps {
  onAdvisoryComplete?: (summary: string) => void;
}

export const FertilizerAdvisory = ({ onAdvisoryComplete }: FertilizerAdvisoryProps) => {
  const { t, language } = useLanguage();
  const { result, isLoading, error, getAdvisory, reset } = useFertilizerAdvisory();
  
  const [cropName, setCropName] = useState('');
  const [customCrop, setCustomCrop] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [soilType, setSoilType] = useState('');

  const crops = getCropsList();
  const stages = getGrowthStages();

  const soilTypes = [
    { value: 'clay', en: 'Clay', hi: 'चिकनी मिट्टी', te: 'బంకమట్టి' },
    { value: 'loamy', en: 'Loamy', hi: 'दोमट', te: 'లోమీ' },
    { value: 'sandy', en: 'Sandy', hi: 'रेतीली', te: 'ఇసుక' },
    { value: 'black', en: 'Black Soil', hi: 'काली मिट्टी', te: 'నల్ల మట్టి' },
    { value: 'red', en: 'Red Soil', hi: 'लाल मिट्टी', te: 'ఎర్ర మట్టి' },
    { value: 'alluvial', en: 'Alluvial', hi: 'जलोढ़', te: 'ఒండ్రు మట్టి' },
  ];

  const labels = {
    en: {
      title: 'Fertilizer Advisory',
      description: 'Get fertilizer recommendations for your crop',
      crop: 'Select Crop',
      customCrop: 'Or enter crop name',
      stage: 'Growth Stage',
      soil: 'Soil Type (Optional)',
      submit: 'Get Fertilizer Advice',
      analyzing: 'Analyzing...',
      reset: 'New Analysis',
      primary: 'Recommended Fertilizers',
      method: 'Application Method',
      timing: 'When to Apply',
      organic: 'Organic Alternatives',
      micronutrients: 'Micronutrients',
      tips: 'Tips',
      warning: 'Warning',
      consult: 'Important',
      discussAI: 'Discuss with AI',
    },
    hi: {
      title: 'उर्वरक सलाह',
      description: 'अपनी फसल के लिए उर्वरक सिफारिशें प्राप्त करें',
      crop: 'फसल चुनें',
      customCrop: 'या फसल का नाम लिखें',
      stage: 'विकास अवस्था',
      soil: 'मिट्टी का प्रकार (वैकल्पिक)',
      submit: 'उर्वरक सलाह प्राप्त करें',
      analyzing: 'विश्लेषण हो रहा है...',
      reset: 'नया विश्लेषण',
      primary: 'अनुशंसित उर्वरक',
      method: 'डालने का तरीका',
      timing: 'कब डालें',
      organic: 'जैविक विकल्प',
      micronutrients: 'सूक्ष्म पोषक तत्व',
      tips: 'सुझाव',
      warning: 'चेतावनी',
      consult: 'महत्वपूर्ण',
      discussAI: 'AI से चर्चा करें',
    },
    te: {
      title: 'ఎరువుల సలహా',
      description: 'మీ పంటకు ఎరువుల సిఫార్సులు పొందండి',
      crop: 'పంట ఎంచుకోండి',
      customCrop: 'లేదా పంట పేరు నమోదు చేయండి',
      stage: 'పెరుగుదల దశ',
      soil: 'నేల రకం (ఐచ్ఛికం)',
      submit: 'ఎరువుల సలహా పొందండి',
      analyzing: 'విశ్లేషిస్తోంది...',
      reset: 'కొత్త విశ్లేషణ',
      primary: 'సిఫార్సు చేసిన ఎరువులు',
      method: 'వాడే పద్ధతి',
      timing: 'ఎప్పుడు వేయాలి',
      organic: 'సేంద్రీయ ప్రత్యామ్నాయాలు',
      micronutrients: 'సూక్ష్మ పోషకాలు',
      tips: 'చిట్కాలు',
      warning: 'హెచ్చరిక',
      consult: 'ముఖ్యం',
      discussAI: 'AI తో చర్చించండి',
    },
  };

  const l = labels[language as keyof typeof labels] || labels.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCrop = cropName === 'other' ? customCrop : cropName;
    
    if (!selectedCrop || !growthStage) {
      return;
    }

    await getAdvisory({
      crop_name: selectedCrop,
      growth_stage: growthStage,
      soil_type: soilType || undefined,
      language,
    });
  };

  const handleReset = () => {
    reset();
    setCropName('');
    setCustomCrop('');
    setGrowthStage('');
    setSoilType('');
  };

  const handleDiscussWithAI = () => {
    if (result && onAdvisoryComplete) {
      const summary = `Fertilizer Advisory: For ${cropName || customCrop} at ${growthStage} stage. Recommended: ${result.primary_fertilizers?.join(', ')}. Organic options: ${result.organic_alternatives?.join(', ')}`;
      onAdvisoryComplete(summary);
    }
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            {l.title}
          </h3>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {l.reset}
          </Button>
        </div>

        {/* Primary Fertilizers */}
        {result.primary_fertilizers && result.primary_fertilizers.length > 0 && (
          <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                <FlaskConical className="h-4 w-4" />
                {l.primary}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-wrap gap-2">
                {result.primary_fertilizers.map((fert, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-green-100 dark:bg-green-900/30">
                    {fert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Application Method & Timing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.application_method && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  {l.method}
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground">{result.application_method}</p>
              </CardContent>
            </Card>
          )}
          
          {result.timing && (
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-sm">{l.timing}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground">{result.timing}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Organic Alternatives */}
        {result.organic_alternatives && result.organic_alternatives.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Leaf className="h-4 w-4" />
                {l.organic}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-wrap gap-2">
                {result.organic_alternatives.map((org, idx) => (
                  <Badge key={idx} variant="outline" className="border-amber-300">
                    {org}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Micronutrients */}
        {result.micronutrients && result.micronutrients.length > 0 && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">{l.micronutrients}</CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <div className="flex flex-wrap gap-2">
                {result.micronutrients.map((micro, idx) => (
                  <Badge key={idx} variant="outline">{micro}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {result.tips && result.tips.length > 0 && (
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                {l.tips}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {result.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Warning */}
        {result.warning && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{l.warning}</AlertTitle>
            <AlertDescription>{result.warning}</AlertDescription>
          </Alert>
        )}

        {/* Consult Note */}
        {result.consult_note && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{l.consult}</AlertTitle>
            <AlertDescription>{result.consult_note}</AlertDescription>
          </Alert>
        )}

        {/* Discuss with AI */}
        <Button onClick={handleDiscussWithAI} className="w-full">
          {l.discussAI}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          {l.title}
        </h2>
        <p className="text-sm text-muted-foreground">{l.description}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Crop Selection */}
      <div className="space-y-2">
        <Label>{l.crop}</Label>
        <Select value={cropName} onValueChange={setCropName}>
          <SelectTrigger>
            <SelectValue placeholder={l.crop} />
          </SelectTrigger>
          <SelectContent>
            {crops.map((crop) => (
              <SelectItem key={crop} value={crop}>
                {getCropName(crop, language)}
              </SelectItem>
            ))}
            <SelectItem value="other">{t('pest.crop.other')}</SelectItem>
          </SelectContent>
        </Select>
        {cropName === 'other' && (
          <Input
            value={customCrop}
            onChange={(e) => setCustomCrop(e.target.value)}
            placeholder={l.customCrop}
          />
        )}
      </div>

      {/* Growth Stage */}
      <div className="space-y-2">
        <Label>{l.stage}</Label>
        <Select value={growthStage} onValueChange={setGrowthStage}>
          <SelectTrigger>
            <SelectValue placeholder={l.stage} />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {getGrowthStageName(stage, language)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Soil Type */}
      <div className="space-y-2">
        <Label>{l.soil}</Label>
        <Select value={soilType} onValueChange={setSoilType}>
          <SelectTrigger>
            <SelectValue placeholder={l.soil} />
          </SelectTrigger>
          <SelectContent>
            {soilTypes.map((soil) => (
              <SelectItem key={soil.value} value={soil.value}>
                {soil[language as keyof typeof soil] || soil.en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || (!cropName && !customCrop) || !growthStage}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {l.analyzing}
          </>
        ) : (
          l.submit
        )}
      </Button>
    </form>
  );
};
