import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCropImageAnalysis } from '@/hooks/useCropImageAnalysis';
import { api } from '@/integrations/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Upload, Loader2, AlertTriangle, X, Bug, Leaf } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CropImageAnalysisProps {
  onAnalysisComplete?: (summary: string) => void;
}

export const CropImageAnalysis = ({ onAnalysisComplete }: CropImageAnalysisProps) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { analysis, isLoading, error, analyzeImage, reset } = useCropImageAnalysis();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('disease.imageOnly'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(t('disease.fileSizeError'));
      return;
    }

    setUploadProgress(true);
    reset();

    try {
      // Upload to Express backend storage
      const result = await api.upload('/storage/upload', file);
      setSelectedImage(result.publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert(t('disease.uploadFailed'));
    } finally {
      setUploadProgress(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    await analyzeImage(selectedImage, additionalInfo, language);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setAdditionalInfo('');
    reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSummaryForChat = (): string => {
    if (!analysis) return '';
    // Extract first line or problem identification for chat
    const firstLine = analysis.split('\n').find(line => line.includes('Identified Problem') || line.includes('पहचानी गई समस्या'));
    return firstLine || t('disease.analysisComplete');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bug className="h-5 w-5 text-primary" />
            {t('disease.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload Area */}
          {!selectedImage ? (
            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {uploadProgress ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="text-muted-foreground">
                    {t('disease.uploading')}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-primary" />
                    </div>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {t('disease.takeUpload')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('disease.clearPhoto')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Uploaded crop" 
                className="w-full h-64 object-cover rounded-xl"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Additional Info */}
          {selectedImage && !analysis && (
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">
                {t('disease.additionalInfo')}
              </Label>
              <Textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder={t('disease.additionalPlaceholder')}
                rows={2}
              />
            </div>
          )}

          {/* Analyze Button */}
          {selectedImage && !analysis && (
            <Button 
              onClick={handleAnalyze} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('disease.analyzing')}
                </>
              ) : (
                <>
                  <Leaf className="mr-2 h-4 w-4" />
                  {t('disease.analyze')}
                </>
              )}
            </Button>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClear}
                >
                  {t('disease.newImage')}
                </Button>
                {onAnalysisComplete && (
                  <Button
                    className="flex-1"
                    onClick={() => onAnalysisComplete(getSummaryForChat())}
                  >
                    {t('disease.askMore')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Card */}
      {!selectedImage && (
        <Card>
          <CardContent className="pt-4">
            <h4 className="font-medium text-foreground mb-2">
              📸 {t('disease.tips')}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t('disease.tip1')}</li>
              <li>• {t('disease.tip2')}</li>
              <li>• {t('disease.tip3')}</li>
              <li>• {t('disease.tip4')}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};