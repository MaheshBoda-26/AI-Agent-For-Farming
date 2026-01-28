import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { CropSuggestionForm } from '@/components/CropSuggestionForm';
import { CropImageAnalysis } from '@/components/CropImageAnalysis';
import { PestAdvisory } from '@/components/PestAdvisory';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Camera, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tools = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('crops');
  const navigate = useNavigate();

  const handleToolComplete = (summary: string) => {
    // Navigate to chat with the summary as context
    navigate('/chat', { state: { initialMessage: summary } });
  };

  const labels = {
    en: {
      title: 'Farming Tools',
      subtitle: 'Get crop suggestions, identify pests and diseases',
      crops: 'Crop Suggestions',
      pest: 'Pest Advisory',
      disease: 'Disease ID',
    },
    hi: {
      title: 'कृषि उपकरण',
      subtitle: 'फसल सुझाव प्राप्त करें, कीट और रोगों की पहचान करें',
      crops: 'फसल सुझाव',
      pest: 'कीट सलाह',
      disease: 'रोग पहचान',
    },
    te: {
      title: 'వ్యవసాయ సాధనాలు',
      subtitle: 'పంట సూచనలు పొందండి, పురుగులు మరియు వ్యాధులను గుర్తించండి',
      crops: 'పంట సూచనలు',
      pest: 'పురుగు సలహా',
      disease: 'వ్యాధి గుర్తింపు',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>

          {/* Tools Card */}
          <div className="max-w-2xl mx-auto bg-card rounded-xl border border-border overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
              <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-border bg-muted/50">
                <TabsTrigger value="crops" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.crops}</span>
                  <span className="sm:hidden">{language === 'hi' ? 'फसल' : 'Crops'}</span>
                </TabsTrigger>
                <TabsTrigger value="pest" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Bug className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.pest}</span>
                  <span className="sm:hidden">{language === 'hi' ? 'कीट' : 'Pest'}</span>
                </TabsTrigger>
                <TabsTrigger value="disease" className="flex items-center gap-2 text-xs sm:text-sm">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.disease}</span>
                  <span className="sm:hidden">{language === 'hi' ? 'रोग' : 'Disease'}</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="crops" className="p-4 m-0">
                <CropSuggestionForm onSuggestionComplete={handleToolComplete} />
              </TabsContent>
              
              <TabsContent value="pest" className="p-4 m-0">
                <PestAdvisory onAdvisoryComplete={handleToolComplete} />
              </TabsContent>
              
              <TabsContent value="disease" className="p-4 m-0">
                <CropImageAnalysis onAnalysisComplete={handleToolComplete} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
