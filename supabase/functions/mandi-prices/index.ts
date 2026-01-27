// Mandi Prices Edge Function - Real-time data from data.gov.in

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interfaces
interface OGDRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

interface MandiPrice {
  crop_name: string;
  crop_name_hi: string;
  state: string;
  mandi: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  date: string;
  trend: "up" | "down" | "stable";
  trend_percent: number;
}

// Hindi crop name mapping
const CROP_HINDI_NAMES: Record<string, string> = {
  "Rice": "धान",
  "Wheat": "गेहूं",
  "Cotton": "कपास",
  "Soybean": "सोयाबीन",
  "Maize": "मक्का",
  "Groundnut": "मूंगफली",
  "Chickpea": "चना",
  "Gram": "चना",
  "Bengal Gram": "चना",
  "Mustard": "सरसों",
  "Onion": "प्याज",
  "Potato": "आलू",
  "Sweet Potato": "शकरकंद",
  "Sugarcane": "गन्ना",
  "Bajra": "बाजरा",
  "Pearl Millet": "बाजरा",
  "Jowar": "ज्वार",
  "Sorghum": "ज्वार",
  "Paddy": "धान",
  "Arhar": "अरहर",
  "Tur": "तूर",
  "Red Gram": "अरहर",
  "Moong": "मूंग",
  "Green Gram": "मूंग",
  "Urad": "उड़द",
  "Black Gram": "उड़द",
  "Masoor": "मसूर",
  "Lentil": "मसूर",
  "Chana": "चना",
  "Soyabean": "सोयाबीन",
  "Groundnut pods": "मूंगफली",
  "Rapeseed": "सरसों",
};

// Supported commodities for filtering (includes API names)
const SUPPORTED_COMMODITIES = [
  "Rice", "Wheat", "Cotton", "Soyabean", "Maize", "Groundnut", 
  "Gram", "Bengal Gram", "Mustard", "Onion", "Potato", "Sweet Potato",
  "Paddy", "Bajra", "Pearl Millet", "Jowar", "Sorghum",
  "Arhar", "Tur", "Red Gram", "Moong", "Green Gram", "Urad", "Black Gram"
];

// Fallback static data when API fails
const FALLBACK_PRICES: MandiPrice[] = [
  { crop_name: "Rice", crop_name_hi: "धान", state: "Punjab", mandi: "Amritsar", min_price: 2100, max_price: 2300, modal_price: 2200, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Wheat", crop_name_hi: "गेहूं", state: "Punjab", mandi: "Ludhiana", min_price: 2275, max_price: 2400, modal_price: 2350, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Cotton", crop_name_hi: "कपास", state: "Gujarat", mandi: "Rajkot", min_price: 6500, max_price: 7200, modal_price: 6900, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Soybean", crop_name_hi: "सोयाबीन", state: "Madhya Pradesh", mandi: "Indore", min_price: 4800, max_price: 5200, modal_price: 5000, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Maize", crop_name_hi: "मक्का", state: "Karnataka", mandi: "Davangere", min_price: 1900, max_price: 2150, modal_price: 2050, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Groundnut", crop_name_hi: "मूंगफली", state: "Gujarat", mandi: "Junagadh", min_price: 5500, max_price: 6200, modal_price: 5900, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Chickpea", crop_name_hi: "चना", state: "Madhya Pradesh", mandi: "Indore", min_price: 5200, max_price: 5800, modal_price: 5500, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Mustard", crop_name_hi: "सरसों", state: "Rajasthan", mandi: "Jaipur", min_price: 5800, max_price: 6400, modal_price: 6100, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Onion", crop_name_hi: "प्याज", state: "Maharashtra", mandi: "Nashik", min_price: 1200, max_price: 1800, modal_price: 1500, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
  { crop_name: "Potato", crop_name_hi: "आलू", state: "Uttar Pradesh", mandi: "Agra", min_price: 800, max_price: 1200, modal_price: 1000, date: new Date().toISOString().split('T')[0], trend: "stable" as const, trend_percent: 0 },
];

// Price trend data (historical comparison)
const CROP_TRENDS: Record<string, { prices: { date: string; price: number }[]; best_selling_month: string; best_selling_month_hi: string; recommendation: string; recommendation_hi: string }> = {
  "Wheat": {
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
    recommendation: "Hold for 1-2 months. Prices typically peak before new harvest arrives in April.",
    recommendation_hi: "1-2 महीने रुकें। अप्रैल में नई फसल आने से पहले कीमतें आमतौर पर चरम पर होती हैं।"
  },
  "Rice": {
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
    recommendation: "Good time to sell. Prices are stable and near seasonal high.",
    recommendation_hi: "बेचने का अच्छा समय। कीमतें स्थिर हैं और मौसमी उच्च के करीब हैं।"
  },
  "Cotton": {
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
    recommendation: "Consider selling now. Prices may decline further as international supply increases.",
    recommendation_hi: "अभी बेचने पर विचार करें। अंतरराष्ट्रीय आपूर्ति बढ़ने पर कीमतें और गिर सकती हैं।"
  },
  "Soybean": {
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
    recommendation: "Excellent time to sell. Prices are rising and near peak.",
    recommendation_hi: "बेचने का उत्कृष्ट समय। कीमतें बढ़ रही हैं और चरम के करीब हैं।"
  },
  "Chickpea": {
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
    recommendation: "Hold for better prices. Demand increases before new harvest season.",
    recommendation_hi: "बेहतर कीमतों के लिए रुकें। नई फसल के मौसम से पहले मांग बढ़ती है।"
  },
  "Mustard": {
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
    recommendation: "Wait 1-2 months for peak prices before new harvest.",
    recommendation_hi: "नई फसल से पहले चरम कीमतों के लिए 1-2 महीने प्रतीक्षा करें।"
  },
  "Onion": {
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
    recommendation: "Store if possible. Prices are low now but may recover in summer.",
    recommendation_hi: "संभव हो तो स्टोर करें। कीमतें अभी कम हैं लेकिन गर्मियों में सुधर सकती हैं।"
  },
  "Potato": {
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
    recommendation: "Store in cold storage. Prices typically peak in summer months.",
    recommendation_hi: "कोल्ड स्टोरेज में रखें। गर्मियों में कीमतें आमतौर पर चरम पर होती हैं।"
  },
};


// Normalize commodity names from API to clean display names
function normalizeCropName(commodity: string): string {
  // Handle complex API names like "Bajra(Pearl Millet/Cumbu)" or "Arhar(Tur/Red Gram)(Whole)"
  const cleanName = commodity
    .replace(/\(Whole\)/gi, '')
    .replace(/\(Dhan\)/gi, '')
    .replace(/\(Cumbu\)/gi, '')
    .trim();
  
  // Direct mappings for common variations
  const mapping: Record<string, string> = {
    "Paddy": "Rice",
    "Paddy(Dhan)": "Rice",
    "Soyabean": "Soybean",
    "Gram": "Chickpea",
    "Bengal Gram(Gram)": "Chickpea",
    "Chana": "Chickpea",
    "Rapeseed": "Mustard",
    "Mustard Oil": "Mustard",
    "Groundnut pods": "Groundnut",
    "Bajra(Pearl Millet)": "Bajra",
    "Bajra(Pearl Millet/Cumbu)": "Bajra",
    "Jowar(Sorghum)": "Jowar",
    "Arhar(Tur/Red Gram)": "Arhar",
    "Black Gram(Urd Beans)": "Urad",
  };
  
  // Check direct mapping first
  if (mapping[cleanName]) return mapping[cleanName];
  if (mapping[commodity]) return mapping[commodity];
  
  // Try partial matching for complex names
  const lowerCommodity = commodity.toLowerCase();
  if (lowerCommodity.includes('paddy')) return 'Rice';
  if (lowerCommodity.includes('bajra') || lowerCommodity.includes('pearl millet')) return 'Bajra';
  if (lowerCommodity.includes('jowar') || lowerCommodity.includes('sorghum')) return 'Jowar';
  if (lowerCommodity.includes('arhar') || lowerCommodity.includes('tur') || lowerCommodity.includes('red gram')) return 'Arhar';
  if (lowerCommodity.includes('bengal gram') || lowerCommodity.includes('gram') || lowerCommodity.includes('chana')) return 'Chickpea';
  if (lowerCommodity.includes('black gram') || lowerCommodity.includes('urad') || lowerCommodity.includes('urd')) return 'Urad';
  if (lowerCommodity.includes('green gram') || lowerCommodity.includes('moong')) return 'Moong';
  
  return cleanName;
}

// Fetch live data from data.gov.in
async function fetchLiveMandiPrices(crop?: string, state?: string): Promise<MandiPrice[]> {
  const apiKey = Deno.env.get("DATA_GOV_IN_API_KEY");
  
  if (!apiKey) {
    console.log("No API key configured, using fallback data");
    return [];
  }

  // data.gov.in resource for variety-wise daily market prices
  const resourceId = "9ef84268-d588-465a-a308-a864a43d0070";
  const baseUrl = `https://api.data.gov.in/resource/${resourceId}`;
  
  const params = new URLSearchParams({
    "api-key": apiKey,
    "format": "json",
    "limit": "100",
  });

  // Add filters
  if (crop) {
    // Map normalized crop name back to commodity name for API
    const commodityMapping: Record<string, string> = {
      "Rice": "Paddy(Dhan)",
      "Chickpea": "Gram",
      "Soybean": "Soyabean",
    };
    params.set("filters[commodity]", commodityMapping[crop] || crop);
  }
  if (state) {
    params.set("filters[state]", state);
  }

  try {
    console.log(`Fetching from data.gov.in: ${baseUrl}?${params.toString().replace(apiKey, "***")}`);
    
    const response = await fetch(`${baseUrl}?${params.toString()}`, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error: ${response.status} - ${errorText}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.records || !Array.isArray(data.records)) {
      console.log("No records in API response");
      return [];
    }

    console.log(`Received ${data.records.length} records from API`);

    // Transform API response to our format
    const prices: MandiPrice[] = data.records
      .filter((record: OGDRecord) => {
        // Filter to supported commodities
        const normalizedCrop = normalizeCropName(record.commodity);
        return SUPPORTED_COMMODITIES.some(c => 
          normalizedCrop.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(normalizedCrop.toLowerCase())
        );
      })
      .map((record: OGDRecord) => {
        const normalizedCrop = normalizeCropName(record.commodity);
        const hindiName = CROP_HINDI_NAMES[normalizedCrop] || CROP_HINDI_NAMES[record.commodity] || record.commodity;
        
        return {
          crop_name: normalizedCrop,
          crop_name_hi: hindiName,
          state: record.state,
          mandi: record.market,
          min_price: parseInt(record.min_price) || 0,
          max_price: parseInt(record.max_price) || 0,
          modal_price: parseInt(record.modal_price) || 0,
          date: record.arrival_date || new Date().toISOString().split('T')[0],
          trend: "stable" as const,
          trend_percent: 0,
        };
      })
      .filter((p: MandiPrice) => p.modal_price > 0); // Filter out invalid prices

    return prices;
  } catch (error) {
    console.error("Failed to fetch from data.gov.in:", error);
    return [];
  }
}

// Get unique values from price array
function getUniqueValues(prices: MandiPrice[], field: "crop_name" | "state"): string[] {
  return [...new Set(prices.map(p => p[field]))].sort();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const crop = url.searchParams.get("crop") || undefined;
    const state = url.searchParams.get("state") || undefined;

    // Try to fetch live data
    let prices = await fetchLiveMandiPrices(crop, state);
    let isLiveData = prices.length > 0;

    // Fallback to static data if API fails
    if (prices.length === 0) {
      console.log("Using fallback static data");
      prices = [...FALLBACK_PRICES];
      
      // Apply filters to fallback data
      if (crop) {
        prices = prices.filter(p => p.crop_name === crop);
      }
      if (state) {
        prices = prices.filter(p => p.state === state);
      }
    }

    // Get trend data for selected crop
    let trend = null;
    if (crop) {
      const trendData = CROP_TRENDS[crop];
      if (trendData) {
        // Get current price from live data or fallback
        const currentPrice = prices.length > 0 
          ? Math.round(prices.reduce((sum, p) => sum + p.modal_price, 0) / prices.length)
          : trendData.prices[trendData.prices.length - 1].price;
        
        trend = {
          crop_name: crop,
          crop_name_hi: CROP_HINDI_NAMES[crop] || crop,
          ...trendData,
          current_price: currentPrice,
          peak_price: Math.max(...trendData.prices.map(p => p.price)) + 200,
        };
      }
    }

    // Get filter options
    const allPrices = prices.length > 0 ? prices : FALLBACK_PRICES;
    const crops = getUniqueValues(allPrices, "crop_name");
    const states = getUniqueValues(allPrices, "state");

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          prices,
          trend,
          filters: {
            crops,
            states,
          },
          last_updated: new Date().toISOString(),
          is_live_data: isLiveData,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in mandi-prices function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Return fallback data on error
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          prices: FALLBACK_PRICES,
          trend: null,
          filters: {
            crops: getUniqueValues(FALLBACK_PRICES, "crop_name"),
            states: getUniqueValues(FALLBACK_PRICES, "state"),
          },
          last_updated: new Date().toISOString(),
          is_live_data: false,
          error: errorMessage,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
