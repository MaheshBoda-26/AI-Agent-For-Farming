import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf } from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-serif font-bold">AI Farming Assistant</p>
              <p className="text-sm opacity-70">{t('footer.tagline')}</p>
            </div>
          </div>

          <div className="text-sm opacity-70 text-center md:text-right">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
};
