import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';

const languages = [
  {
    code: 'en' as const,
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'hi' as const,
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
  },
  {
    code: 'te' as const,
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
  },
];

export const LanguageSelectDialog = () => {
  const { language, setLanguage, hasSelectedLanguage, setHasSelectedLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  useEffect(() => {
    // Show dialog on first visit if language hasn't been selected
    if (!hasSelectedLanguage) {
      setIsOpen(true);
    }
  }, [hasSelectedLanguage]);

  const handleConfirm = () => {
    setLanguage(selectedLang);
    setHasSelectedLanguage(true);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Globe className="h-7 w-7 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-serif text-center">
            Select Your Language
          </DialogTitle>
          <DialogDescription className="text-center">
            अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                selectedLang === lang.code
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent'
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1 text-left">
                <p className="font-semibold text-foreground">{lang.nativeName}</p>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </div>
              {selectedLang === lang.code && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>

        <Button onClick={handleConfirm} size="lg" className="w-full">
          {selectedLang === 'hi' ? 'जारी रखें' : selectedLang === 'te' ? 'కొనసాగించు' : 'Continue'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
