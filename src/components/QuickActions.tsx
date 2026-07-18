import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onSelect: (query: string) => void;
}

export const QuickActions = ({ onSelect }: QuickActionsProps) => {
  const { t } = useLanguage();

  const actions = [
    {
      label: t('quick.crop'),
      query: t('quick.crop.query'),
    },
    {
      label: t('quick.weather'),
      query: t('quick.weather.query'),
    },
    {
      label: t('quick.pest'),
      query: t('quick.pest.query'),
    },
    {
      label: t('quick.market'),
      query: t('quick.market.query'),
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
