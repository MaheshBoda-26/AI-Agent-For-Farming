import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Minus, IndianRupee, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useMandiPrices, MandiPrice, CropTrend } from '@/hooks/useMandiPrices';
import { MANDI_PRICES, CROP_PRICE_TRENDS, getUniqueCrops, getUniqueStates } from '@/data/mandiPrices';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function MarketPrices() {
  const { language, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [prices, setPrices] = useState<MandiPrice[]>(MANDI_PRICES);
  const [trend, setTrend] = useState<CropTrend | null>(null);

  const crops = getUniqueCrops();
  const states = getUniqueStates();

  useEffect(() => {
    let filtered = [...MANDI_PRICES];
    if (selectedCrop) {
      filtered = filtered.filter(p => p.crop_name === selectedCrop);
      const cropTrend = CROP_PRICE_TRENDS.find(t => t.crop_name === selectedCrop);
      setTrend(cropTrend || null);
    } else {
      setTrend(null);
    }
    if (selectedState) {
      filtered = filtered.filter(p => p.state === selectedState);
    }
    setPrices(filtered);
  }, [selectedCrop, selectedState]);

  const getTrendIcon = (trendType: 'up' | 'down' | 'stable') => {
    switch (trendType) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trendType: 'up' | 'down' | 'stable') => {
    switch (trendType) {
      case 'up':
        return 'text-green-600 bg-green-50 dark:bg-green-950';
      case 'down':
        return 'text-red-600 bg-red-50 dark:bg-red-950';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const chartConfig = {
    price: {
      label: language === 'hi' ? 'कीमत' : 'Price',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === 'hi' ? 'मंडी भाव' : 'Mandi Prices'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'hi' 
              ? 'विभिन्न फसलों के वर्तमान बाजार भाव और रुझान देखें'
              : 'View current market prices and trends for different crops'}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={language === 'hi' ? 'फसल चुनें' : 'Select Crop'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {language === 'hi' ? 'सभी फसलें' : 'All Crops'}
              </SelectItem>
              {crops.map(crop => (
                <SelectItem key={crop} value={crop}>{crop}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={language === 'hi' ? 'राज्य चुनें' : 'Select State'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">
                {language === 'hi' ? 'सभी राज्य' : 'All States'}
              </SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Trend Chart (when crop selected) */}
        {trend && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                {language === 'hi' ? `${trend.crop_name_hi} मूल्य रुझान` : `${trend.crop_name} Price Trend`}
              </CardTitle>
              <CardDescription>
                {language === 'hi' ? 'पिछले 6 महीने का मूल्य इतिहास' : 'Price history for the last 6 months'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="md:col-span-2">
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <AreaChart data={trend.prices}>
                      <defs>
                        <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#priceGradient)"
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>

                {/* Insights */}
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === 'hi' ? 'वर्तमान कीमत' : 'Current Price'}
                    </p>
                    <p className="text-2xl font-bold text-foreground flex items-center">
                      <IndianRupee className="h-5 w-5" />
                      {trend.current_price}/
                      <span className="text-sm font-normal text-muted-foreground">
                        {language === 'hi' ? 'क्विंटल' : 'quintal'}
                      </span>
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === 'hi' ? 'बेचने का सबसे अच्छा समय' : 'Best Selling Time'}
                    </p>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {language === 'hi' ? trend.best_selling_month_hi : trend.best_selling_month}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-sm font-medium text-primary mb-1">
                      {language === 'hi' ? 'सिफारिश' : 'Recommendation'}
                    </p>
                    <p className="text-sm text-foreground">
                      {language === 'hi' ? trend.recommendation_hi : trend.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Price Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {prices.map((price, idx) => (
            <Card key={`${price.crop_name}-${price.mandi}-${idx}`} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {language === 'hi' ? price.crop_name_hi : price.crop_name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {price.mandi}, {price.state}
                    </p>
                  </div>
                  <Badge variant="secondary" className={getTrendColor(price.trend)}>
                    {getTrendIcon(price.trend)}
                    <span className="ml-1">
                      {price.trend_percent > 0 ? '+' : ''}{price.trend_percent}%
                    </span>
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === 'hi' ? 'न्यूनतम' : 'Min'}
                    </span>
                    <span className="font-medium">₹{price.min_price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {language === 'hi' ? 'अधिकतम' : 'Max'}
                    </span>
                    <span className="font-medium">₹{price.max_price}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-2">
                    <span className="font-medium text-foreground">
                      {language === 'hi' ? 'मोडल भाव' : 'Modal Price'}
                    </span>
                    <span className="font-bold text-primary">₹{price.modal_price}/q</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {prices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'hi' 
                ? 'चयनित फ़िल्टर के लिए कोई डेटा उपलब्ध नहीं है'
                : 'No data available for selected filters'}
            </p>
          </div>
        )}

        {/* Info Note */}
        <Card className="mt-8 bg-muted/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>{language === 'hi' ? 'नोट:' : 'Note:'}</strong>{' '}
              {language === 'hi' 
                ? 'कीमतें प्रति क्विंटल (100 किलो) में हैं। वास्तविक कीमतें स्थानीय मंडी में भिन्न हो सकती हैं।'
                : 'Prices are per quintal (100 kg). Actual prices may vary at local mandis.'}
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
