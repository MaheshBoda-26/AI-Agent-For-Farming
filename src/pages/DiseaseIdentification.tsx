import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { CropImageAnalysis } from '@/components/CropImageAnalysis';
import { useLanguage } from '@/contexts/LanguageContext';

const DiseaseIdentification = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleComplete = (summary: string) => {
    navigate('/chat', { state: { initialMessage: summary } });
  };

  const labels = {
    en: { title: 'Disease Identification', subtitle: 'Upload a photo to identify crop diseases' },
    hi: { title: 'रोग पहचान', subtitle: 'फसल रोगों की पहचान के लिए फोटो अपलोड करें' },
    te: { title: 'వ్యాధి గుర్తింపు', subtitle: 'పంట వ్యాధులను గుర్తించడానికి ఫోటో అప్‌లోడ్ చేయండి' },
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
            <CropImageAnalysis onAnalysisComplete={handleComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseIdentification;
