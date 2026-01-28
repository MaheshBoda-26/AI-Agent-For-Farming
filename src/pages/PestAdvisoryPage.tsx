import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { PestAdvisory } from '@/components/PestAdvisory';
import { useLanguage } from '@/contexts/LanguageContext';

const PestAdvisoryPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleComplete = (summary: string) => {
    navigate('/chat', { state: { initialMessage: summary } });
  };

  const labels = {
    en: { title: 'Pest Advisory', subtitle: 'Identify pests and get safe control recommendations' },
    hi: { title: 'कीट सलाह', subtitle: 'कीटों की पहचान करें और सुरक्षित नियंत्रण सुझाव प्राप्त करें' },
    te: { title: 'పురుగు సలహా', subtitle: 'పురుగులను గుర్తించండి మరియు సురక్షిత నియంత్రణ సిఫార్సులు పొందండి' },
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
            <PestAdvisory onAdvisoryComplete={handleComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestAdvisoryPage;
