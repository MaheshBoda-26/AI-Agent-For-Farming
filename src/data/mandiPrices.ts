// Mandi Price Dataset - Simulated current market data for Indian crops
// In production, this would be fetched from APIs like data.gov.in or Agmarknet

export interface MandiPrice {
  crop_name: string;
  crop_name_hi: string;
  crop_name_te: string;
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
  crop_name_te: string;
  prices: {
    date: string;
    price: number;
  }[];
  best_selling_month: string;
  best_selling_month_hi: string;
  best_selling_month_te: string;
  peak_price: number;
  current_price: number;
  recommendation: string;
  recommendation_hi: string;
  recommendation_te: string;
}

// All 28 Indian states with major mandis
const ALL_INDIAN_STATES = [
  { state: "Andhra Pradesh", mandis: ["Kurnool", "Guntur", "Vijayawada"] },
  { state: "Arunachal Pradesh", mandis: ["Itanagar", "Naharlagun"] },
  { state: "Assam", mandis: ["Guwahati", "Dibrugarh", "Silchar"] },
  { state: "Bihar", mandis: ["Patna", "Muzaffarpur", "Bhagalpur"] },
  { state: "Chhattisgarh", mandis: ["Raipur", "Bilaspur", "Durg"] },
  { state: "Goa", mandis: ["Panaji", "Margao"] },
  { state: "Gujarat", mandis: ["Rajkot", "Ahmedabad", "Junagadh", "Surat"] },
  { state: "Haryana", mandis: ["Karnal", "Hisar", "Ambala", "Rohtak"] },
  { state: "Himachal Pradesh", mandis: ["Shimla", "Mandi", "Kullu"] },
  { state: "Jharkhand", mandis: ["Ranchi", "Jamshedpur", "Dhanbad"] },
  { state: "Karnataka", mandis: ["Davangere", "Hubli", "Belgaum", "Mysore"] },
  { state: "Kerala", mandis: ["Kochi", "Thiruvananthapuram", "Kozhikode"] },
  { state: "Madhya Pradesh", mandis: ["Indore", "Bhopal", "Jabalpur", "Gwalior"] },
  { state: "Maharashtra", mandis: ["Nashik", "Nagpur", "Pune", "Aurangabad", "Latur"] },
  { state: "Manipur", mandis: ["Imphal", "Thoubal"] },
  { state: "Meghalaya", mandis: ["Shillong", "Tura"] },
  { state: "Mizoram", mandis: ["Aizawl", "Lunglei"] },
  { state: "Nagaland", mandis: ["Dimapur", "Kohima"] },
  { state: "Odisha", mandis: ["Bhubaneswar", "Cuttack", "Sambalpur"] },
  { state: "Punjab", mandis: ["Amritsar", "Ludhiana", "Jalandhar", "Patiala"] },
  { state: "Rajasthan", mandis: ["Jaipur", "Jodhpur", "Bikaner", "Udaipur", "Kota"] },
  { state: "Sikkim", mandis: ["Gangtok", "Namchi"] },
  { state: "Tamil Nadu", mandis: ["Chennai", "Coimbatore", "Madurai", "Salem"] },
  { state: "Telangana", mandis: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"] },
  { state: "Tripura", mandis: ["Agartala", "Udaipur"] },
  { state: "Uttar Pradesh", mandis: ["Lucknow", "Agra", "Kanpur", "Varanasi", "Muzaffarnagar"] },
  { state: "Uttarakhand", mandis: ["Dehradun", "Haridwar", "Rudrapur"] },
  { state: "West Bengal", mandis: ["Kolkata", "Hooghly", "Siliguri", "Bardhaman"] },
];

// Crop data with base prices
const CROP_BASE_DATA = [
  { crop_name: "Rice", crop_name_hi: "धान", crop_name_te: "వరి", base_price: 2200, variance: 150, trend: "up" as const, trend_percent: 3.5 },
  { crop_name: "Wheat", crop_name_hi: "गेहूं", crop_name_te: "గోధుమ", base_price: 2350, variance: 100, trend: "up" as const, trend_percent: 4.2 },
  { crop_name: "Cotton", crop_name_hi: "कपास", crop_name_te: "పత్తి", base_price: 6900, variance: 400, trend: "down" as const, trend_percent: -2.3 },
  { crop_name: "Soybean", crop_name_hi: "सोयाबीन", crop_name_te: "సోయాబీన్", base_price: 5000, variance: 250, trend: "up" as const, trend_percent: 5.1 },
  { crop_name: "Maize", crop_name_hi: "मक्का", crop_name_te: "మొక్కజొన్న", base_price: 2050, variance: 150, trend: "stable" as const, trend_percent: 0.8 },
  { crop_name: "Groundnut", crop_name_hi: "मूंगफली", crop_name_te: "వేరుశెనగ", base_price: 5900, variance: 350, trend: "up" as const, trend_percent: 3.2 },
  { crop_name: "Chickpea", crop_name_hi: "चना", crop_name_te: "శెనగలు", base_price: 5500, variance: 300, trend: "up" as const, trend_percent: 6.2 },
  { crop_name: "Mustard", crop_name_hi: "सरसों", crop_name_te: "ఆవాలు", base_price: 6100, variance: 300, trend: "up" as const, trend_percent: 4.5 },
  { crop_name: "Onion", crop_name_hi: "प्याज", crop_name_te: "ఉల్లిపాయ", base_price: 1500, variance: 300, trend: "down" as const, trend_percent: -8.5 },
  { crop_name: "Potato", crop_name_hi: "आलू", crop_name_te: "బంగాళాదుంప", base_price: 1000, variance: 200, trend: "stable" as const, trend_percent: 1.5 },
  { crop_name: "Sugarcane", crop_name_hi: "गन्ना", crop_name_te: "చెరకు", base_price: 375, variance: 25, trend: "stable" as const, trend_percent: 0.5 },
  { crop_name: "Bajra", crop_name_hi: "बाजरा", crop_name_te: "సజ్జలు", base_price: 2250, variance: 150, trend: "up" as const, trend_percent: 2.8 },
  { crop_name: "Jowar", crop_name_hi: "ज्वार", crop_name_te: "జొన్నలు", base_price: 2800, variance: 200, trend: "stable" as const, trend_percent: 1.2 },
  { crop_name: "Arhar", crop_name_hi: "अरहर", crop_name_te: "కందిపప్పు", base_price: 6500, variance: 400, trend: "up" as const, trend_percent: 3.8 },
  { crop_name: "Moong", crop_name_hi: "मूंग", crop_name_te: "పెసలు", base_price: 7500, variance: 500, trend: "up" as const, trend_percent: 4.1 },
  { crop_name: "Urad", crop_name_hi: "उड़द", crop_name_te: "మినుములు", base_price: 6800, variance: 400, trend: "stable" as const, trend_percent: 0.9 },
];

// Deterministic pseudo-random function based on seed
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate mandi prices for all 28 states
function generateMandiPrices(): MandiPrice[] {
  const prices: MandiPrice[] = [];
  const today = "2026-01-27";
  
  ALL_INDIAN_STATES.forEach((stateData, stateIndex) => {
    CROP_BASE_DATA.forEach((crop, cropIndex) => {
      // Add 1-2 mandis per state per crop
      const mandiCount = Math.min(2, stateData.mandis.length);
      for (let i = 0; i < mandiCount; i++) {
        const mandi = stateData.mandis[i];
        const seed = stateIndex * 1000 + cropIndex * 10 + i;
        const priceVariation = Math.floor((seededRandom(seed) - 0.5) * crop.variance * 2);
        const modalPrice = crop.base_price + priceVariation;
        
        prices.push({
          crop_name: crop.crop_name,
          crop_name_hi: crop.crop_name_hi,
          crop_name_te: crop.crop_name_te,
          state: stateData.state,
          mandi: mandi,
          min_price: modalPrice - Math.floor(crop.variance * 0.5),
          max_price: modalPrice + Math.floor(crop.variance * 0.5),
          modal_price: modalPrice,
          date: today,
          trend: crop.trend,
          trend_percent: crop.trend_percent + (seededRandom(seed + 1) - 0.5) * 2,
        });
      }
    });
  });
  
  return prices;
}

// Current mandi prices - covers all 28 Indian states
export const MANDI_PRICES: MandiPrice[] = generateMandiPrices();

// Historical price trends (last 6 months)
export const CROP_PRICE_TRENDS: CropPriceTrend[] = [
  {
    crop_name: "Wheat",
    crop_name_hi: "गेहूं",
    crop_name_te: "గోధుమ",
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
    best_selling_month_te: "మార్చి-ఏప్రిల్",
    peak_price: 2500,
    current_price: 2350,
    recommendation: "Hold for 1-2 months. Prices typically peak before new harvest arrives in April.",
    recommendation_hi: "1-2 महीने रुकें। अप्रैल में नई फसल आने से पहले कीमतें आमतौर पर चरम पर होती हैं।",
    recommendation_te: "1-2 నెలలు వేచి ఉండండి. ఏప్రిల్‌లో కొత్త పంట రాకముందు ధరలు గరిష్ఠంగా ఉంటాయి."
  },
  {
    crop_name: "Rice",
    crop_name_hi: "धान",
    crop_name_te: "వరి",
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
    best_selling_month_te: "ఫిబ్రవరి-మార్చి",
    peak_price: 2400,
    current_price: 2200,
    recommendation: "Good time to sell. Prices are stable and near seasonal high.",
    recommendation_hi: "बेचने का अच्छा समय। कीमतें स्थिर हैं और मौसमी उच्च के करीब हैं।",
    recommendation_te: "అమ్మడానికి మంచి సమయం. ధరలు స్థిరంగా మరియు సీజన్ గరిష్ఠానికి దగ్గరగా ఉన్నాయి."
  },
  {
    crop_name: "Cotton",
    crop_name_hi: "कपास",
    crop_name_te: "పత్తి",
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
    best_selling_month_te: "అక్టోబర్-నవంబర్",
    peak_price: 7500,
    current_price: 6900,
    recommendation: "Consider selling now. Prices may decline further as international supply increases.",
    recommendation_hi: "अभी बेचने पर विचार करें। अंतरराष्ट्रीय आपूर्ति बढ़ने पर कीमतें और गिर सकती हैं।",
    recommendation_te: "ఇప్పుడు అమ్మడం పరిగణించండి. అంతర్జాతీయ సరఫరా పెరిగితే ధరలు మరింత తగ్గవచ్చు."
  },
  {
    crop_name: "Soybean",
    crop_name_hi: "सोयाबीन",
    crop_name_te: "సోయాబీన్",
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
    best_selling_month_te: "జనవరి-ఫిబ్రవరి",
    peak_price: 5300,
    current_price: 5000,
    recommendation: "Excellent time to sell. Prices are rising and near peak.",
    recommendation_hi: "बेचने का उत्कृष्ट समय। कीमतें बढ़ रही हैं और चरम के करीब हैं।",
    recommendation_te: "అమ్మడానికి అద్భుతమైన సమయం. ధరలు పెరుగుతున్నాయి మరియు గరిష్ఠానికి దగ్గరగా ఉన్నాయి."
  },
  {
    crop_name: "Chickpea",
    crop_name_hi: "चना",
    crop_name_te: "శెనగలు",
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
    best_selling_month_te: "ఫిబ్రవరి-మార్చి",
    peak_price: 5800,
    current_price: 5500,
    recommendation: "Hold for better prices. Demand increases before new harvest season.",
    recommendation_hi: "बेहतर कीमतों के लिए रुकें। नई फसल के मौसम से पहले मांग बढ़ती है।",
    recommendation_te: "మెరుగైన ధరల కోసం వేచి ఉండండి. కొత్త పంట సీజన్ ముందు డిమాండ్ పెరుగుతుంది."
  },
  {
    crop_name: "Mustard",
    crop_name_hi: "सरसों",
    crop_name_te: "ఆవాలు",
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
    best_selling_month_te: "మార్చి-ఏప్రిల్",
    peak_price: 6500,
    current_price: 6100,
    recommendation: "Wait 1-2 months for peak prices before new harvest.",
    recommendation_hi: "नई फसल से पहले चरम कीमतों के लिए 1-2 महीने प्रतीक्षा करें।",
    recommendation_te: "కొత్త పంట ముందు గరిష్ఠ ధరల కోసం 1-2 నెలలు వేచి ఉండండి."
  },
  {
    crop_name: "Onion",
    crop_name_hi: "प्याज",
    crop_name_te: "ఉల్లిపాయ",
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
    best_selling_month_te: "ఆగస్ట్-సెప్టెంబర్",
    peak_price: 2500,
    current_price: 1500,
    recommendation: "Store if possible. Prices are low now but may recover in summer.",
    recommendation_hi: "संभव हो तो स्टोर करें। कीमतें अभी कम हैं लेकिन गर्मियों में सुधर सकती हैं।",
    recommendation_te: "సాధ్యమైతే నిల్వ చేయండి. ధరలు ఇప్పుడు తక్కువగా ఉన్నాయి కానీ వేసవిలో మెరుగవచ్చు."
  },
  {
    crop_name: "Potato",
    crop_name_hi: "आलू",
    crop_name_te: "బంగాళాదుంప",
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
    best_selling_month_te: "మే-జూన్",
    peak_price: 1400,
    current_price: 1000,
    recommendation: "Store in cold storage. Prices typically peak in summer months.",
    recommendation_hi: "कोल्ड स्टोरेज में रखें। गर्मियों में कीमतें आमतौर पर चरम पर होती हैं।",
    recommendation_te: "కోల్డ్ స్టోరేజీలో నిల్వ చేయండి. వేసవి నెలల్లో ధరలు సాధారణంగా గరిష్ఠంగా ఉంటాయి."
  },
  {
    crop_name: "Maize",
    crop_name_hi: "मक्का",
    crop_name_te: "మొక్కజొన్న",
    prices: [
      { date: "Aug 2025", price: 1850 },
      { date: "Sep 2025", price: 1900 },
      { date: "Oct 2025", price: 1950 },
      { date: "Nov 2025", price: 2000 },
      { date: "Dec 2025", price: 2020 },
      { date: "Jan 2026", price: 2050 },
    ],
    best_selling_month: "March-April",
    best_selling_month_hi: "मार्च-अप्रैल",
    best_selling_month_te: "మార్చి-ఏప్రిల్",
    peak_price: 2300,
    current_price: 2050,
    recommendation: "Good prices currently. Consider gradual selling.",
    recommendation_hi: "वर्तमान में अच्छी कीमतें। धीरे-धीरे बेचने पर विचार करें।",
    recommendation_te: "ప్రస్తుతం మంచి ధరలు. క్రమంగా అమ్మడం పరిగణించండి."
  },
  {
    crop_name: "Groundnut",
    crop_name_hi: "मूंगफली",
    crop_name_te: "వేరుశెనగ",
    prices: [
      { date: "Aug 2025", price: 5500 },
      { date: "Sep 2025", price: 5600 },
      { date: "Oct 2025", price: 5700 },
      { date: "Nov 2025", price: 5750 },
      { date: "Dec 2025", price: 5850 },
      { date: "Jan 2026", price: 5900 },
    ],
    best_selling_month: "February-March",
    best_selling_month_hi: "फरवरी-मार्च",
    best_selling_month_te: "ఫిబ్రవరి-మార్చి",
    peak_price: 6300,
    current_price: 5900,
    recommendation: "Prices rising steadily. Hold for 1 more month for better returns.",
    recommendation_hi: "कीमतें लगातार बढ़ रही हैं। बेहतर रिटर्न के लिए 1 और महीने रुकें।",
    recommendation_te: "ధరలు స్థిరంగా పెరుగుతున్నాయి. మెరుగైన లాభాల కోసం మరో 1 నెల వేచి ఉండండి."
  },
  {
    crop_name: "Arhar",
    crop_name_hi: "अरहर",
    crop_name_te: "కందిపప్పు",
    prices: [
      { date: "Aug 2025", price: 6000 },
      { date: "Sep 2025", price: 6100 },
      { date: "Oct 2025", price: 6200 },
      { date: "Nov 2025", price: 6350 },
      { date: "Dec 2025", price: 6400 },
      { date: "Jan 2026", price: 6500 },
    ],
    best_selling_month: "March-April",
    best_selling_month_hi: "मार्च-अप्रैल",
    best_selling_month_te: "మార్చి-ఏప్రిల్",
    peak_price: 7000,
    current_price: 6500,
    recommendation: "Hold for better prices before new crop arrives.",
    recommendation_hi: "नई फसल आने से पहले बेहतर कीमतों के लिए रुकें।",
    recommendation_te: "కొత్త పంట రాకముందు మెరుగైన ధరల కోసం వేచి ఉండండి."
  },
  {
    crop_name: "Moong",
    crop_name_hi: "मूंग",
    crop_name_te: "పెసలు",
    prices: [
      { date: "Aug 2025", price: 7000 },
      { date: "Sep 2025", price: 7100 },
      { date: "Oct 2025", price: 7250 },
      { date: "Nov 2025", price: 7350 },
      { date: "Dec 2025", price: 7450 },
      { date: "Jan 2026", price: 7500 },
    ],
    best_selling_month: "April-May",
    best_selling_month_hi: "अप्रैल-मई",
    best_selling_month_te: "ఏప్రిల్-మే",
    peak_price: 8000,
    current_price: 7500,
    recommendation: "Strong demand. Prices expected to rise further.",
    recommendation_hi: "मजबूत मांग। कीमतें और बढ़ने की उम्मीद।",
    recommendation_te: "బలమైన డిమాండ్. ధరలు మరింత పెరుగుతాయని భావిస్తున్నారు."
  },
  {
    crop_name: "Urad",
    crop_name_hi: "उड़द",
    crop_name_te: "మినుములు",
    prices: [
      { date: "Aug 2025", price: 6500 },
      { date: "Sep 2025", price: 6550 },
      { date: "Oct 2025", price: 6600 },
      { date: "Nov 2025", price: 6700 },
      { date: "Dec 2025", price: 6750 },
      { date: "Jan 2026", price: 6800 },
    ],
    best_selling_month: "March-April",
    best_selling_month_hi: "मार्च-अप्रैल",
    best_selling_month_te: "మార్చి-ఏప్రిల్",
    peak_price: 7200,
    current_price: 6800,
    recommendation: "Stable market. Good time for gradual selling.",
    recommendation_hi: "स्थिर बाजार। धीरे-धीरे बेचने का अच्छा समय।",
    recommendation_te: "స్థిరమైన మార్కెట్. క్రమంగా అమ్మడానికి మంచి సమయం."
  },
  {
    crop_name: "Bajra",
    crop_name_hi: "बाजरा",
    crop_name_te: "సజ్జలు",
    prices: [
      { date: "Aug 2025", price: 2050 },
      { date: "Sep 2025", price: 2100 },
      { date: "Oct 2025", price: 2120 },
      { date: "Nov 2025", price: 2180 },
      { date: "Dec 2025", price: 2220 },
      { date: "Jan 2026", price: 2250 },
    ],
    best_selling_month: "February-March",
    best_selling_month_hi: "फरवरी-मार्च",
    best_selling_month_te: "ఫిబ్రవరి-మార్చి",
    peak_price: 2500,
    current_price: 2250,
    recommendation: "Prices improving. Hold for better returns.",
    recommendation_hi: "कीमतें सुधर रही हैं। बेहतर रिटर्न के लिए रुकें।",
    recommendation_te: "ధరలు మెరుగుపడుతున్నాయి. మెరుగైన లాభాల కోసం వేచి ఉండండి."
  },
  {
    crop_name: "Jowar",
    crop_name_hi: "ज्वार",
    crop_name_te: "జొన్నలు",
    prices: [
      { date: "Aug 2025", price: 2600 },
      { date: "Sep 2025", price: 2650 },
      { date: "Oct 2025", price: 2700 },
      { date: "Nov 2025", price: 2720 },
      { date: "Dec 2025", price: 2780 },
      { date: "Jan 2026", price: 2800 },
    ],
    best_selling_month: "March-April",
    best_selling_month_hi: "मार्च-अप्रैल",
    best_selling_month_te: "మార్చి-ఏప్రిల్",
    peak_price: 3100,
    current_price: 2800,
    recommendation: "Moderate demand. Consider selling if storage is an issue.",
    recommendation_hi: "मध्यम मांग। स्टोरेज समस्या हो तो बेचने पर विचार करें।",
    recommendation_te: "మధ్యస్థ డిమాండ్. నిల్వ సమస్య ఉంటే అమ్మడం పరిగణించండి."
  },
  {
    crop_name: "Sugarcane",
    crop_name_hi: "गन्ना",
    crop_name_te: "చెరకు",
    prices: [
      { date: "Aug 2025", price: 350 },
      { date: "Sep 2025", price: 355 },
      { date: "Oct 2025", price: 360 },
      { date: "Nov 2025", price: 365 },
      { date: "Dec 2025", price: 370 },
      { date: "Jan 2026", price: 375 },
    ],
    best_selling_month: "November-February",
    best_selling_month_hi: "नवंबर-फरवरी",
    best_selling_month_te: "నవంబర్-ఫిబ్రవరి",
    peak_price: 400,
    current_price: 375,
    recommendation: "Peak crushing season. Sell to nearby mills for best prices.",
    recommendation_hi: "पीक क्रशिंग सीजन। सबसे अच्छी कीमतों के लिए पास की मिलों को बेचें।",
    recommendation_te: "పీక్ క్రషింగ్ సీజన్. మంచి ధరల కోసం సమీపంలోని మిల్లులకు అమ్మండి."
  },
];

// Get unique crops from price data
export function getUniqueCrops(): string[] {
  return [...new Set(MANDI_PRICES.map(p => p.crop_name))].sort();
}

// Get unique states from price data
export function getUniqueStates(): string[] {
  return [...new Set(MANDI_PRICES.map(p => p.state))].sort();
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

// Get crop translations map for dropdowns
export function getCropTranslations(): { [key: string]: { en: string; hi: string; te: string } } {
  const translations: { [key: string]: { en: string; hi: string; te: string } } = {};
  CROP_BASE_DATA.forEach(crop => {
    translations[crop.crop_name] = {
      en: crop.crop_name,
      hi: crop.crop_name_hi,
      te: crop.crop_name_te
    };
  });
  return translations;
}
