import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { PestAdvisory } from '@/components/PestAdvisory';
import { FertilizerAdvisory } from '@/components/FertilizerAdvisory';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bug, Leaf } from 'lucide-react';

const PestAdvisoryPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleComplete = (summary: string) => {
    navigate('/chat', { state: { initialMessage: summary } });
  };

  const labels = {
    en: { 
      title: 'Crop Advisory', 
      subtitle: 'Get pest control and fertilizer recommendations',
      pestTab: 'Pest Advisory',
      fertilizerTab: 'Fertilizer Advisory',
    },
    hi: { 
      title: 'फसल सलाह', 
      subtitle: 'कीट नियंत्रण और उर्वरक सिफारिशें प्राप्त करें',
      pestTab: 'कीट सलाह',
      fertilizerTab: 'उर्वरक सलाह',
    },
    te: { 
      title: 'పంట సలహా', 
      subtitle: 'పురుగుల నియంత్రణ మరియు ఎరువుల సిఫార్సులు పొందండి',
      pestTab: 'పురుగు సలహా',
      fertilizerTab: 'ఎరువుల సలహా',
    },
  };

  const t = labels[language as keyof typeof labels] || labels.en;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle}</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Tabs defaultValue="pest" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="pest" className="flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  {t.pestTab}
                </TabsTrigger>
                <TabsTrigger value="fertilizer" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  {t.fertilizerTab}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pest">
                <PestAdvisory onAdvisoryComplete={handleComplete} />
              </TabsContent>
              <TabsContent value="fertilizer">
                <FertilizerAdvisory onAdvisoryComplete={handleComplete} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestAdvisoryPage;
