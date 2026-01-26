import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Kisan Mitra AI" className="h-16 object-contain brightness-0 invert" />
          </div>

          <div className="text-sm opacity-70 text-center md:text-right">
            {t('footer.copyright')}
          </div>
        </div>
      </div>
    </footer>
  );
};
