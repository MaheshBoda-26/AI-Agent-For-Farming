import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onSelect: (query: string) => void;
}

export const QuickActions = ({ onSelect }: QuickActionsProps) => {
  const { t, language } = useLanguage();

  const actions = [
    {
      label: t('quick.crop'),
      query: language === 'hi' 
        ? 'मुझे अपनी फसल के बारे में सलाह चाहिए'
        : language === 'te'
        ? 'నా పంట గురించి నాకు సలహా కావాలి'
        : 'I need advice about my crop',
    },
    {
      label: t('quick.weather'),
      query: language === 'hi'
        ? 'आज का मौसम कैसा है?'
        : language === 'te'
        ? 'ఈ రోజు వాతావరణం ఎలా ఉంది?'
        : 'What is the weather forecast?',
    },
    {
      label: t('quick.pest'),
      query: language === 'hi'
        ? 'मेरी फसल में कीट लग गए हैं'
        : language === 'te'
        ? 'నా పంటలో చీడపీడలు వచ్చాయి'
        : 'I have pest problems in my crop',
    },
    {
      label: t('quick.market'),
      query: language === 'hi'
        ? 'आज मंडी में क्या भाव है?'
        : language === 'te'
        ? 'ఈ రోజు మార్కెట్ ధరలు ఏమిటి?'
        : 'What are the current market prices?',
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(action.query)}
          className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};
