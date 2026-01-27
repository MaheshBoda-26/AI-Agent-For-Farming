// Mandi Price Dataset - Simulated current market data for Indian crops
// In production, this would be fetched from APIs like data.gov.in or Agmarknet

export interface MandiPrice {
  crop_name: string;
  crop_name_hi: string;
  state: string;
  mandi: string;
  min_price: number; // Rs per quintal
  max_price: number;
  modal_price: number; // Most common price
  date: string;
  trend: 'up' | 'down' | 'stable';
  trend_percent: number;
}

export interface CropPriceTrend {
  crop_name: string;
  crop_name_hi: string;
  prices: {
    date: string;
    price: number;
  }[];
  best_selling_month: string;
  best_selling_month_hi: string;
  peak_price: number;
  current_price: number;
  recommendation: string;
  recommendation_hi: string;
}

// Current mandi prices (simulated real-time data)
export const MANDI_PRICES: MandiPrice[] = [
  // Rice
  { crop_name: "Rice", crop_name_hi: "धान", state: "Punjab", mandi: "Amritsar", min_price: 2100, max_price: 2300, modal_price: 2200, date: "2026-01-27", trend: "up", trend_percent: 3.5 },
  { crop_name: "Rice", crop_name_hi: "धान", state: "Uttar Pradesh", mandi: "Lucknow", min_price: 2000, max_price: 2250, modal_price: 2150, date: "2026-01-27", trend: "stable", trend_percent: 0.5 },
  { crop_name: "Rice", crop_name_hi: "धान", state: "West Bengal", mandi: "Kolkata", min_price: 1950, max_price: 2200, modal_price: 2100, date: "2026-01-27", trend: "up", trend_percent: 2.1 },
  
  // Wheat
  { crop_name: "Wheat", crop_name_hi: "गेहूं", state: "Punjab", mandi: "Ludhiana", min_price: 2275, max_price: 2400, modal_price: 2350, date: "2026-01-27", trend: "up", trend_percent: 4.2 },
  { crop_name: "Wheat", crop_name_hi: "गेहूं", state: "Haryana", mandi: "Karnal", min_price: 2250, max_price: 2380, modal_price: 2320, date: "2026-01-27", trend: "up", trend_percent: 3.8 },
  { crop_name: "Wheat", crop_name_hi: "गेहूं", state: "Madhya Pradesh", mandi: "Indore", min_price: 2200, max_price: 2350, modal_price: 2280, date: "2026-01-27", trend: "stable", trend_percent: 1.2 },
  
  // Cotton
  { crop_name: "Cotton", crop_name_hi: "कपास", state: "Gujarat", mandi: "Rajkot", min_price: 6500, max_price: 7200, modal_price: 6900, date: "2026-01-27", trend: "down", trend_percent: -2.3 },
  { crop_name: "Cotton", crop_name_hi: "कपास", state: "Maharashtra", mandi: "Nagpur", min_price: 6400, max_price: 7100, modal_price: 6800, date: "2026-01-27", trend: "down", trend_percent: -1.8 },
  
  // Soybean
  { crop_name: "Soybean", crop_name_hi: "सोयाबीन", state: "Madhya Pradesh", mandi: "Indore", min_price: 4800, max_price: 5200, modal_price: 5000, date: "2026-01-27", trend: "up", trend_percent: 5.1 },
  { crop_name: "Soybean", crop_name_hi: "सोयाबीन", state: "Maharashtra", mandi: "Latur", min_price: 4700, max_price: 5100, modal_price: 4900, date: "2026-01-27", trend: "up", trend_percent: 4.5 },
  
  // Maize
  { crop_name: "Maize", crop_name_hi: "मक्का", state: "Karnataka", mandi: "Davangere", min_price: 1900, max_price: 2150, modal_price: 2050, date: "2026-01-27", trend: "stable", trend_percent: 0.8 },
  { crop_name: "Maize", crop_name_hi: "मक्का", state: "Bihar", mandi: "Patna", min_price: 1850, max_price: 2100, modal_price: 2000, date: "2026-01-27", trend: "up", trend_percent: 2.5 },
  
  // Groundnut
  { crop_name: "Groundnut", crop_name_hi: "मूंगफली", state: "Gujarat", mandi: "Junagadh", min_price: 5500, max_price: 6200, modal_price: 5900, date: "2026-01-27", trend: "up", trend_percent: 3.2 },
  { crop_name: "Groundnut", crop_name_hi: "मूंगफली", state: "Andhra Pradesh", mandi: "Kurnool", min_price: 5400, max_price: 6100, modal_price: 5800, date: "2026-01-27", trend: "stable", trend_percent: 1.0 },
  
  // Chickpea
  { crop_name: "Chickpea", crop_name_hi: "चना", state: "Madhya Pradesh", mandi: "Indore", min_price: 5200, max_price: 5800, modal_price: 5500, date: "2026-01-27", trend: "up", trend_percent: 6.2 },
  { crop_name: "Chickpea", crop_name_hi: "चना", state: "Rajasthan", mandi: "Bikaner", min_price: 5100, max_price: 5700, modal_price: 5400, date: "2026-01-27", trend: "up", trend_percent: 5.8 },
  
  // Mustard
  { crop_name: "Mustard", crop_name_hi: "सरसों", state: "Rajasthan", mandi: "Jaipur", min_price: 5800, max_price: 6400, modal_price: 6100, date: "2026-01-27", trend: "up", trend_percent: 4.5 },
  { crop_name: "Mustard", crop_name_hi: "सरसों", state: "Haryana", mandi: "Hisar", min_price: 5700, max_price: 6300, modal_price: 6000, date: "2026-01-27", trend: "up", trend_percent: 4.0 },
  
  // Onion
  { crop_name: "Onion", crop_name_hi: "प्याज", state: "Maharashtra", mandi: "Nashik", min_price: 1200, max_price: 1800, modal_price: 1500, date: "2026-01-27", trend: "down", trend_percent: -8.5 },
  { crop_name: "Onion", crop_name_hi: "प्याज", state: "Karnataka", mandi: "Hubli", min_price: 1100, max_price: 1700, modal_price: 1400, date: "2026-01-27", trend: "down", trend_percent: -7.2 },
  
  // Potato
  { crop_name: "Potato", crop_name_hi: "आलू", state: "Uttar Pradesh", mandi: "Agra", min_price: 800, max_price: 1200, modal_price: 1000, date: "2026-01-27", trend: "stable", trend_percent: 1.5 },
  { crop_name: "Potato", crop_name_hi: "आलू", state: "West Bengal", mandi: "Hooghly", min_price: 750, max_price: 1150, modal_price: 950, date: "2026-01-27", trend: "up", trend_percent: 2.8 },
  
  // Sugarcane
  { crop_name: "Sugarcane", crop_name_hi: "गन्ना", state: "Uttar Pradesh", mandi: "Muzaffarnagar", min_price: 350, max_price: 400, modal_price: 375, date: "2026-01-27", trend: "stable", trend_percent: 0.5 },
  { crop_name: "Sugarcane", crop_name_hi: "गन्ना", state: "Maharashtra", mandi: "Kolhapur", min_price: 340, max_price: 390, modal_price: 365, date: "2026-01-27", trend: "stable", trend_percent: 0.3 },
];

// Historical price trends (last 6 months)
export const CROP_PRICE_TRENDS: CropPriceTrend[] = [
  {
    crop_name: "Wheat",
    crop_name_hi: "गेहूं",
    prices: [
      { date: "Aug 2025", price: 2100 },
      { date: "Sep 2025", price: 2150 },
      { date: "Oct 2025", price: 2180 },
      { date: "Nov 2025", price: 2220 },
      { date: "Dec 2025", price: 2280 },
      { date: "Jan 2026", price: 2350 },
    ],
    best_selling_month: "March-April",
    best_selling_month_hi: "मार्च-अप्रैल",
    peak_price: 2500,
    current_price: 2350,
    recommendation: "Hold for 1-2 months. Prices typically peak before new harvest arrives in April.",
    recommendation_hi: "1-2 महीने रुकें। अप्रैल में नई फसल आने से पहले कीमतें आमतौर पर चरम पर होती हैं।"
  },
  {
    crop_name: "Rice",
    crop_name_hi: "धान",
    prices: [
      { date: "Aug 2025", price: 1950 },
      { date: "Sep 2025", price: 2000 },
      { date: "Oct 2025", price: 2050 },
      { date: "Nov 2025", price: 2100 },
      { date: "Dec 2025", price: 2150 },
      { date: "Jan 2026", price: 2200 },
    ],
    best_selling_month: "February-March",
    best_selling_month_hi: "फरवरी-मार्च",
    peak_price: 2400,
    current_price: 2200,
    recommendation: "Good time to sell. Prices are stable and near seasonal high.",
    recommendation_hi: "बेचने का अच्छा समय। कीमतें स्थिर हैं और मौसमी उच्च के करीब हैं।"
  },
  {
    crop_name: "Cotton",
    crop_name_hi: "कपास",
    prices: [
      { date: "Aug 2025", price: 7200 },
      { date: "Sep 2025", price: 7100 },
      { date: "Oct 2025", price: 7000 },
      { date: "Nov 2025", price: 6950 },
      { date: "Dec 2025", price: 6850 },
      { date: "Jan 2026", price: 6900 },
    ],
    best_selling_month: "October-November",
    best_selling_month_hi: "अक्टूबर-नवंबर",
    peak_price: 7500,
    current_price: 6900,
    recommendation: "Consider selling now. Prices may decline further as international supply increases.",
    recommendation_hi: "अभी बेचने पर विचार करें। अंतरराष्ट्रीय आपूर्ति बढ़ने पर कीमतें और गिर सकती हैं।"
  },
  {
    crop_name: "Soybean",
    crop_name_hi: "सोयाबीन",
    prices: [
      { date: "Aug 2025", price: 4200 },
      { date: "Sep 2025", price: 4400 },
      { date: "Oct 2025", price: 4600 },
      { date: "Nov 2025", price: 4750 },
      { date: "Dec 2025", price: 4850 },
      { date: "Jan 2026", price: 5000 },
    ],
    best_selling_month: "January-February",
    best_selling_month_hi: "जनवरी-फरवरी",
    peak_price: 5300,
    current_price: 5000,
    recommendation: "Excellent time to sell. Prices are rising and near peak.",
    recommendation_hi: "बेचने का उत्कृष्ट समय। कीमतें बढ़ रही हैं और चरम के करीब हैं।"
  },
  {
    crop_name: "Chickpea",
    crop_name_hi: "चना",
    prices: [
      { date: "Aug 2025", price: 4800 },
      { date: "Sep 2025", price: 4900 },
      { date: "Oct 2025", price: 5000 },
      { date: "Nov 2025", price: 5150 },
      { date: "Dec 2025", price: 5300 },
      { date: "Jan 2026", price: 5500 },
    ],
    best_selling_month: "February-March",
    best_selling_month_hi: "फरवरी-मार्च",
    peak_price: 5800,
    current_price: 5500,
    recommendation: "Hold for better prices. Demand increases before new harvest season.",
    recommendation_hi: "बेहतर कीमतों के लिए रुकें। नई फसल के मौसम से पहले मांग बढ़ती है।"
  },
  {
    crop_name: "Mustard",
    crop_name_hi: "सरसों",
    prices: [
      { date: "Aug 2025", price: 5400 },
      { date: "Sep 2025", price: 5500 },
      { date: "Oct 2025", price: 5650 },
      { date: "Nov 2025", price: 5800 },
      { date: "Dec 2025", price: 5950 },
      { date: "Jan 2026", price: 6100 },
    ],
    best_selling_month: "March-April",
    best_selling_month_hi: "मार्च-अप्रैल",
    peak_price: 6500,
    current_price: 6100,
    recommendation: "Wait 1-2 months for peak prices before new harvest.",
    recommendation_hi: "नई फसल से पहले चरम कीमतों के लिए 1-2 महीने प्रतीक्षा करें।"
  },
  {
    crop_name: "Onion",
    crop_name_hi: "प्याज",
    prices: [
      { date: "Aug 2025", price: 2200 },
      { date: "Sep 2025", price: 2000 },
      { date: "Oct 2025", price: 1800 },
      { date: "Nov 2025", price: 1650 },
      { date: "Dec 2025", price: 1600 },
      { date: "Jan 2026", price: 1500 },
    ],
    best_selling_month: "August-September",
    best_selling_month_hi: "अगस्त-सितंबर",
    peak_price: 2500,
    current_price: 1500,
    recommendation: "Store if possible. Prices are low now but may recover in summer.",
    recommendation_hi: "संभव हो तो स्टोर करें। कीमतें अभी कम हैं लेकिन गर्मियों में सुधर सकती हैं।"
  },
  {
    crop_name: "Potato",
    crop_name_hi: "आलू",
    prices: [
      { date: "Aug 2025", price: 1100 },
      { date: "Sep 2025", price: 1050 },
      { date: "Oct 2025", price: 1000 },
      { date: "Nov 2025", price: 950 },
      { date: "Dec 2025", price: 980 },
      { date: "Jan 2026", price: 1000 },
    ],
    best_selling_month: "May-June",
    best_selling_month_hi: "मई-जून",
    peak_price: 1400,
    current_price: 1000,
    recommendation: "Store in cold storage. Prices typically peak in summer months.",
    recommendation_hi: "कोल्ड स्टोरेज में रखें। गर्मियों में कीमतें आमतौर पर चरम पर होती हैं।"
  },
];

// Get unique crops from price data
export function getUniqueCrops(): string[] {
  return [...new Set(MANDI_PRICES.map(p => p.crop_name))];
}

// Get unique states from price data
export function getUniqueStates(): string[] {
  return [...new Set(MANDI_PRICES.map(p => p.state))];
}

// Filter prices by crop and/or state
export function filterPrices(crop?: string, state?: string): MandiPrice[] {
  return MANDI_PRICES.filter(p => {
    if (crop && p.crop_name !== crop) return false;
    if (state && p.state !== state) return false;
    return true;
  });
}

// Get trend data for a specific crop
export function getCropTrend(cropName: string): CropPriceTrend | undefined {
  return CROP_PRICE_TRENDS.find(t => t.crop_name === cropName);
}
