import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div className="flex rounded-lg border border-border overflow-hidden">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="rounded-none px-3 py-1 text-sm"
        >
          EN
        </Button>
        <Button
          variant={language === 'hi' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('hi')}
          className="rounded-none px-3 py-1 text-sm"
        >
          हिं
        </Button>
        <Button
          variant={language === 'te' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('te')}
          className="rounded-none px-3 py-1 text-sm"
        >
          తె
        </Button>
      </div>
    </div>
  );
};
