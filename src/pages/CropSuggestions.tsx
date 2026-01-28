import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { CropSuggestionForm } from '@/components/CropSuggestionForm';
import { useLanguage } from '@/contexts/LanguageContext';

const CropSuggestions = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleComplete = (summary: string) => {
    navigate('/chat', { state: { initialMessage: summary } });
  };

  const labels = {
    en: { title: 'Crop Suggestions', subtitle: 'Get personalized crop recommendations based on your location and soil' },
    hi: { title: 'फसल सुझाव', subtitle: 'अपने स्थान और मिट्टी के आधार पर व्यक्तिगत फसल सुझाव प्राप्त करें' },
    te: { title: 'పంట సూచనలు', subtitle: 'మీ స్థానం మరియు నేల ఆధారంగా వ్యక్తిగత పంట సిఫార్సులు పొందండి' },
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
            <CropSuggestionForm onSuggestionComplete={handleComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropSuggestions;
