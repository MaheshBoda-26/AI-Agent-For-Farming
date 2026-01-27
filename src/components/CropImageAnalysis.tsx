import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCropImageAnalysis } from '@/hooks/useCropImageAnalysis';
import { supabase } from '@/integrations/supabase/client';
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
  const { language } = useLanguage();
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
      alert(language === 'hi' ? 'कृपया केवल छवि फ़ाइलें अपलोड करें' : 'Please upload only image files');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'hi' ? 'फ़ाइल का आकार 10MB से कम होना चाहिए' : 'File size must be less than 10MB');
      return;
    }

    setUploadProgress(true);
    reset();

    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `crop-${timestamp}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('crop-images')
        .getPublicUrl(uploadData.path);

      setSelectedImage(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      alert(language === 'hi' ? 'छवि अपलोड करने में विफल' : 'Failed to upload image');
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
    return firstLine || (language === 'hi' ? 'फसल विश्लेषण पूर्ण' : 'Crop analysis complete');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bug className="h-5 w-5 text-primary" />
            {language === 'hi' ? 'फसल रोग/कीट पहचान' : 'Crop Disease/Pest Identification'}
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
                    {language === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...'}
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
                      {language === 'hi' ? 'फसल की फोटो लें या अपलोड करें' : 'Take or Upload Crop Photo'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'hi' 
                        ? 'रोगग्रस्त पत्तियों, तने या फल की स्पष्ट फोटो लें'
                        : 'Take a clear photo of affected leaves, stems, or fruits'}
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
                {language === 'hi' ? 'अतिरिक्त जानकारी (वैकल्पिक)' : 'Additional Information (Optional)'}
              </Label>
              <Textarea
                id="additionalInfo"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder={language === 'hi' 
                  ? 'फसल का नाम, लक्षण कब दिखे, आदि...'
                  : 'Crop name, when symptoms appeared, etc...'}
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
                  {language === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing...'}
                </>
              ) : (
                <>
                  <Leaf className="mr-2 h-4 w-4" />
                  {language === 'hi' ? 'छवि का विश्लेषण करें' : 'Analyze Image'}
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
                  {language === 'hi' ? 'नई छवि' : 'New Image'}
                </Button>
                {onAnalysisComplete && (
                  <Button
                    className="flex-1"
                    onClick={() => onAnalysisComplete(getSummaryForChat())}
                  >
                    {language === 'hi' ? 'AI से और पूछें' : 'Ask AI More'}
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
              {language === 'hi' ? '📸 अच्छी फोटो के लिए सुझाव' : '📸 Tips for Good Photos'}
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {language === 'hi' ? 'प्रभावित भाग को करीब से लें' : 'Take close-up of affected parts'}</li>
              <li>• {language === 'hi' ? 'अच्छी रोशनी में फोटो लें' : 'Use good lighting'}</li>
              <li>• {language === 'hi' ? 'पत्ती के दोनों तरफ की फोटो लें' : 'Capture both sides of leaves'}</li>
              <li>• {language === 'hi' ? 'कई प्रभावित पौधों की फोटो लें' : 'Include multiple affected plants'}</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
