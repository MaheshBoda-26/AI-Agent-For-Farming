import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { Footer } from '@/components/Footer';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherAlertWidget } from '@/components/WeatherAlertWidget';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const { t } = useLanguage();

  const steps = [
    { step: '1', title: t('index.step1.title'), desc: t('index.step1.desc') },
    { step: '2', title: t('index.step2.title'), desc: t('index.step2.desc') },
    { step: '3', title: t('index.step3.title'), desc: t('index.step3.desc') },
  ];

  const benefits = [
    t('benefit.free'),
    t('benefit.languages'),
    t('benefit.availability'),
    t('benefit.noregistration'),
  ];

  return (
    <div className="min-h-screen bg-background pt-[116px]">
      <WeatherAlertWidget />
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                {t('index.steps.title')}
              </h2>
              <div className="space-y-4 mb-8">
                {steps.map((item) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-foreground font-bold">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <WeatherCard />
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('tip.title')}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {t('tip.content')}
                </p>
                <Link to="/chat">
                  <Button variant="outline" size="sm" className="group">
                    {t('tip.more')}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary-foreground mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Link to="/chat">
            <Button size="lg" variant="secondary" className="group">
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
