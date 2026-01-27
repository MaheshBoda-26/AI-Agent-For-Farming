import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, IndianRupee, Calendar, MapPin, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useMandiPrices, MandiPrice } from '@/hooks/useMandiPrices';
import { MANDI_PRICES, CROP_PRICE_TRENDS, getUniqueCrops, getUniqueStates, CropPriceTrend } from '@/data/mandiPrices';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Area, AreaChart, XAxis, YAxis } from 'recharts';

export default function MarketPrices() {
  const { language } = useLanguage();
  const { data: apiData, isLoading, error, fetchPrices } = useMandiPrices();
  
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');

  // Use API data if available, otherwise fallback to static data
  const isLiveData = apiData?.is_live_data ?? false;
  const lastUpdated = apiData?.last_updated ? new Date(apiData.last_updated).toLocaleString() : null;
  
  // Get prices from API or fallback
  const allPrices = apiData?.prices ?? MANDI_PRICES;
  
  // Apply filters
  let filteredPrices = [...allPrices];
  if (selectedCrop) {
    filteredPrices = filteredPrices.filter(p => p.crop_name === selectedCrop);
  }
  if (selectedState) {
    filteredPrices = filteredPrices.filter(p => p.state === selectedState);
  }

  // Get trend data
  const trend = selectedCrop 
    ? (apiData?.trend || CROP_PRICE_TRENDS.find(t => t.crop_name === selectedCrop))
    : null;

  // Get filter options
  const crops = apiData?.filters?.crops ?? getUniqueCrops();
  const states = apiData?.filters?.states ?? getUniqueStates();

  // Refetch when filters change
  useEffect(() => {
    fetchPrices(selectedCrop || undefined, selectedState || undefined);
  }, [selectedCrop, selectedState, fetchPrices]);

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {language === 'hi' ? 'मंडी भाव' : 'Mandi Prices'}
              </h1>
              <p className="text-muted-foreground">
                {language === 'hi' 
                  ? 'विभिन्न फसलों के वर्तमान बाजार भाव और रुझान देखें'
                  : 'View current market prices and trends for different crops'}
              </p>
            </div>
            
            {/* Data source indicator */}
            <div className="flex items-center gap-3">
              <Badge 
                variant={isLiveData ? "default" : "secondary"}
                className={isLiveData ? "bg-green-600" : ""}
              >
                {isLiveData ? (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    {language === 'hi' ? 'लाइव डेटा' : 'Live Data'}
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    {language === 'hi' ? 'डेमो डेटा' : 'Demo Data'}
                  </>
                )}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchPrices(selectedCrop || undefined, selectedState || undefined)}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {language === 'hi' ? 'ताज़ा करें' : 'Refresh'}
              </Button>
            </div>
          </div>
          
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'hi' ? 'अंतिम अपडेट:' : 'Last updated:'} {lastUpdated}
            </p>
          )}
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

        {/* Loading State */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-24 mb-2" />
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="p-4">
              <p className="text-destructive">
                {language === 'hi' ? 'डेटा लोड करने में त्रुटि:' : 'Error loading data:'} {error}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Price Trend Chart (when crop selected) */}
        {trend && !isLoading && (
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
        {!isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPrices.map((price, idx) => (
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
        )}

        {!isLoading && filteredPrices.length === 0 && (
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
              {isLiveData && (
                <span className="block mt-1">
                  {language === 'hi' 
                    ? 'डेटा स्रोत: data.gov.in (Open Government Data Platform)'
                    : 'Data source: data.gov.in (Open Government Data Platform)'}
                </span>
              )}
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
