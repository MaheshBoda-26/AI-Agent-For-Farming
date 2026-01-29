import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePestAdvisory } from '@/hooks/usePestAdvisory';
import { getCropsList, getGrowthStages } from '@/data/pestDatabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bug, CheckCircle, Camera, Loader2, RefreshCw, Shield, Info, FlaskConical } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PestAdvisoryProps {
  onAdvisoryComplete?: (summary: string) => void;
}

export const PestAdvisory = ({ onAdvisoryComplete }: PestAdvisoryProps) => {
  const { t, language } = useLanguage();
  const { result, isLoading, error, getAdvisory, reset } = usePestAdvisory();
  
  const [cropName, setCropName] = useState('');
  const [customCrop, setCustomCrop] = useState('');
  const [growthStage, setGrowthStage] = useState('');
  const [symptomsText, setSymptomsText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const crops = getCropsList();
  const stages = getGrowthStages();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCrop = cropName === 'other' ? customCrop : cropName;
    
    if (!selectedCrop || !growthStage || !symptomsText) {
      return;
    }

    await getAdvisory({
      crop_name: selectedCrop,
      growth_stage: growthStage,
      symptoms_text: symptomsText,
      image_base64: imagePreview || undefined,
      language,
    });
  };

  const handleReset = () => {
    reset();
    setCropName('');
    setCustomCrop('');
    setGrowthStage('');
    setSymptomsText('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDiscussWithAI = () => {
    if (result && onAdvisoryComplete) {
      const summary = result.pest_name 
        ? `Pest Advisory: ${result.pest_name_local || result.pest_name} identified with ${Math.round(result.confidence * 100)}% confidence. Actions: ${result.actions?.slice(0, 2).join(', ')}`
        : 'No pest identified. Need expert consultation.';
      onAdvisoryComplete(summary);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return 'bg-green-500';
    if (confidence >= 0.4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bug className="h-5 w-5" />
            {result.pest_name ? (result.pest_name_local || result.pest_name) : t('pest.noPestFound')}
          </h3>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('pest.reset')}
          </Button>
        </div>

        {result.pest_name ? (
          <>
            {/* Confidence and Risk */}
            <div className="flex gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{t('pest.confidence')}:</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getConfidenceColor(result.confidence)} transition-all`}
                      style={{ width: `${result.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{Math.round(result.confidence * 100)}%</span>
                </div>
              </div>
              {result.pest_type && (
                <Badge variant="outline">{result.pest_type}</Badge>
              )}
            </div>

            {/* Reasons */}
            {result.reasons && result.reasons.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    {t('pest.reasons')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {result.reasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Organic & Mechanical Actions */}
            {result.actions && result.actions.length > 0 && (
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    {t('pest.actions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {result.actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Chemical Options */}
            {result.chemical_options && result.chemical_options.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <FlaskConical className="h-4 w-4" />
                    {t('pest.chemicalOptions')}
                  </CardTitle>
                  <CardDescription className="text-xs text-amber-600 dark:text-amber-500">
                    {t('pest.chemicalDisclaimer')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {result.chemical_options.map((chemical, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-amber-100 dark:bg-amber-900/30">
                        {chemical}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prevention */}
            {result.prevention && result.prevention.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {t('pest.prevention')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {result.prevention.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Risk Warning */}
            {result.risk_note && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{t('pest.riskNote')}</AlertTitle>
                <AlertDescription>{result.risk_note}</AlertDescription>
              </Alert>
            )}

            {/* Follow Up */}
            {result.follow_up && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>{t('pest.followUp')}</AlertTitle>
                <AlertDescription>{result.follow_up}</AlertDescription>
              </Alert>
            )}

            {/* Other Candidates */}
            {result.other_candidates && result.other_candidates.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">{t('pest.otherPossible')}</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex flex-wrap gap-2">
                    {result.other_candidates.map((candidate, idx) => (
                      <Badge key={idx} variant="outline">
                        {candidate.pest_name} ({Math.round(candidate.confidence * 100)}%)
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Discuss with AI */}
            <Button onClick={handleDiscussWithAI} className="w-full">
              {t('pest.discussWithAI')}
            </Button>
          </>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t('pest.noPestFound')}</AlertTitle>
            <AlertDescription>{result.message || result.risk_note}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
          <Bug className="h-5 w-5" />
          {t('pest.title')}
        </h2>
        <p className="text-sm text-muted-foreground">{t('pest.description')}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Crop Selection */}
      <div className="space-y-2">
        <Label>{t('pest.crop')}</Label>
        <Select value={cropName} onValueChange={setCropName}>
          <SelectTrigger>
            <SelectValue placeholder={t('pest.crop')} />
          </SelectTrigger>
          <SelectContent>
            {crops.map((crop) => (
              <SelectItem key={crop} value={crop}>
                {crop.charAt(0).toUpperCase() + crop.slice(1)}
              </SelectItem>
            ))}
            <SelectItem value="other">Other / अन्य / ఇతర</SelectItem>
          </SelectContent>
        </Select>
        {cropName === 'other' && (
          <Input
            value={customCrop}
            onChange={(e) => setCustomCrop(e.target.value)}
            placeholder={t('pest.customCrop')}
          />
        )}
      </div>

      {/* Growth Stage */}
      <div className="space-y-2">
        <Label>{t('pest.stage')}</Label>
        <Select value={growthStage} onValueChange={setGrowthStage}>
          <SelectTrigger>
            <SelectValue placeholder={t('pest.stage')} />
          </SelectTrigger>
          <SelectContent>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage.charAt(0).toUpperCase() + stage.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <Label>{t('pest.symptoms')}</Label>
        <Textarea
          value={symptomsText}
          onChange={(e) => setSymptomsText(e.target.value)}
          placeholder={t('pest.symptomsPlaceholder')}
          rows={3}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Camera className="h-4 w-4" />
          {t('pest.image')}
        </Label>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="cursor-pointer"
        />
        {imagePreview && (
          <div className="mt-2">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-h-32 rounded-md object-cover"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || (!cropName && !customCrop) || !growthStage || !symptomsText}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('pest.analyzing')}
          </>
        ) : (
          t('pest.submit')
        )}
      </Button>
    </form>
  );
};
