import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Cloud, Bug, TrendingUp } from 'lucide-react';

export const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Sprout,
      title: t('features.crop.title'),
      description: t('features.crop.desc'),
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/10',
    },
    {
      icon: Cloud,
      title: t('features.weather.title'),
      description: t('features.weather.desc'),
      color: 'text-chart-3',
      bgColor: 'bg-chart-3/10',
    },
    {
      icon: Bug,
      title: t('features.pest.title'),
      description: t('features.pest.desc'),
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/10',
    },
    {
      icon: TrendingUp,
      title: t('features.market.title'),
      description: t('features.market.desc'),
      color: 'text-chart-2',
      bgColor: 'bg-chart-2/10',
    },
  ];

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg group"
            >
              <CardHeader>
                <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
