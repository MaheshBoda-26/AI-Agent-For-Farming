import { useState, useEffect } from 'react';
import { useLanguage, INDIAN_LANGUAGES } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import logo from '@/assets/logo.png';

const POPULAR_CODES = ['en', 'hi', 'te', 'bn', 'ta', 'mr', 'gu', 'kn', 'ml', 'pa'];

export const LanguageSelectDialog = () => {
  const { language, setLanguage, hasSelectedLanguage, setHasSelectedLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  useEffect(() => {
    if (!hasSelectedLanguage) {
      setIsOpen(true);
    }
  }, [hasSelectedLanguage]);

  const handleConfirm = () => {
    setLanguage(selectedLang);
    setHasSelectedLanguage(true);
    setIsOpen(false);
  };

  const popular = INDIAN_LANGUAGES.filter(l => POPULAR_CODES.includes(l.code));
  const others = INDIAN_LANGUAGES.filter(l => !POPULAR_CODES.includes(l.code));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4">
            <img src={logo} alt="Kisan Mitra AI" className="h-20 object-contain" />
          </div>
          <DialogTitle className="text-2xl font-serif text-center">
            Select Your Language
          </DialogTitle>
          <DialogDescription className="text-center">
            अपनी भाषा चुनें • మీ భాషను ఎంచుకోండి • আপনার ভাষা নির্বাচন করুন
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-3">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Popular</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {popular.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedLang === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{lang.nativeName}</p>
                  <p className="text-xs text-muted-foreground">{lang.name}</p>
                </div>
                {selectedLang === lang.code && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">More Languages</p>
          <div className="grid grid-cols-2 gap-2">
            {others.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  selectedLang === lang.code
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-accent'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{lang.nativeName}</p>
                  <p className="text-xs text-muted-foreground">{lang.name}</p>
                </div>
                {selectedLang === lang.code && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>

        <Button onClick={handleConfirm} size="lg" className="w-full">
          {selectedLang === 'hi' ? 'जारी रखें' : selectedLang === 'te' ? 'కొనసాగించు' : selectedLang === 'bn' ? 'চালিয়ে যান' : selectedLang === 'ta' ? 'தொடரவும்' : 'Continue'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
