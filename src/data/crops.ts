// Crop Master Dataset for Indian Agriculture
// Fields: crop_name, suitable_states, suitable_seasons, suitable_soils, rainfall/temp ranges

export interface CropData {
  crop_name: string;
  crop_name_hi: string;
  suitable_states: string[];
  suitable_seasons: ('Kharif' | 'Rabi' | 'Zaid')[];
  suitable_soils: string[];
  min_rainfall_mm: number;
  max_rainfall_mm: number;
  min_temp: number;
  max_temp: number;
  water_requirement: 'low' | 'medium' | 'high';
  growth_duration_days: number;
}

export const CROPS_DATABASE: CropData[] = [
  // Kharif Crops (June-October, Monsoon)
  {
    crop_name: "Rice",
    crop_name_hi: "धान",
    suitable_states: ["Andhra Pradesh", "Telangana", "West Bengal", "Punjab", "Uttar Pradesh", "Bihar", "Tamil Nadu", "Odisha", "Karnataka", "Assam", "Haryana", "Madhya Pradesh", "Chhattisgarh", "Kerala", "Maharashtra"],
    suitable_seasons: ["Kharif"],
    suitable_soils: ["Alluvial", "Clay", "Clayey Loam"],
    min_rainfall_mm: 100,
    max_rainfall_mm: 200,
    min_temp: 20,
    max_temp: 35,
    water_requirement: "high",
    growth_duration_days: 120
  },
  {
    crop_name: "Cotton",
    crop_name_hi: "कपास",
    suitable_states: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Karnataka", "Madhya Pradesh", "Rajasthan", "Punjab", "Haryana"],
    suitable_seasons: ["Kharif"],
    suitable_soils: ["Black", "Alluvial", "Sandy Loam"],
    min_rainfall_mm: 50,
    max_rainfall_mm: 100,
    min_temp: 21,
    max_temp: 35,
    water_requirement: "medium",
    growth_duration_days: 180
  },
  {
    crop_name: "Maize",
    crop_name_hi: "मक्का",
    suitable_states: ["Karnataka", "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Bihar", "Rajasthan", "Maharashtra", "Uttar Pradesh", "Gujarat", "Tamil Nadu"],
    suitable_seasons: ["Kharif", "Rabi"],
    suitable_soils: ["Alluvial", "Red", "Sandy Loam", "Loamy"],
    min_rainfall_mm: 50,
    max_rainfall_mm: 100,
    min_temp: 18,
    max_temp: 32,
    water_requirement: "medium",
    growth_duration_days: 100
  },
  {
    crop_name: "Sorghum",
    crop_name_hi: "ज्वार",
    suitable_states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Rajasthan", "Gujarat", "Tamil Nadu"],
    suitable_seasons: ["Kharif", "Rabi"],
    suitable_soils: ["Black", "Red", "Alluvial", "Sandy Loam"],
    min_rainfall_mm: 40,
    max_rainfall_mm: 100,
    min_temp: 20,
    max_temp: 40,
    water_requirement: "low",
    growth_duration_days: 110
  },
  {
    crop_name: "Pearl Millet",
    crop_name_hi: "बाजरा",
    suitable_states: ["Rajasthan", "Maharashtra", "Gujarat", "Uttar Pradesh", "Haryana", "Karnataka", "Madhya Pradesh", "Tamil Nadu"],
    suitable_seasons: ["Kharif"],
    suitable_soils: ["Sandy", "Sandy Loam", "Alluvial", "Red"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 60,
    min_temp: 25,
    max_temp: 42,
    water_requirement: "low",
    growth_duration_days: 90
  },
  {
    crop_name: "Groundnut",
    crop_name_hi: "मूंगफली",
    suitable_states: ["Gujarat", "Andhra Pradesh", "Tamil Nadu", "Karnataka", "Rajasthan", "Maharashtra", "Madhya Pradesh"],
    suitable_seasons: ["Kharif", "Rabi"],
    suitable_soils: ["Sandy Loam", "Red", "Alluvial", "Loamy"],
    min_rainfall_mm: 50,
    max_rainfall_mm: 125,
    min_temp: 20,
    max_temp: 35,
    water_requirement: "medium",
    growth_duration_days: 120
  },
  {
    crop_name: "Soybean",
    crop_name_hi: "सोयाबीन",
    suitable_states: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana"],
    suitable_seasons: ["Kharif"],
    suitable_soils: ["Black", "Alluvial", "Clay", "Loamy"],
    min_rainfall_mm: 60,
    max_rainfall_mm: 100,
    min_temp: 20,
    max_temp: 32,
    water_requirement: "medium",
    growth_duration_days: 100
  },
  {
    crop_name: "Sugarcane",
    crop_name_hi: "गन्ना",
    suitable_states: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Bihar", "Andhra Pradesh", "Punjab", "Haryana"],
    suitable_seasons: ["Kharif"],
    suitable_soils: ["Alluvial", "Black", "Loamy", "Clay"],
    min_rainfall_mm: 75,
    max_rainfall_mm: 150,
    min_temp: 20,
    max_temp: 38,
    water_requirement: "high",
    growth_duration_days: 365
  },
  
  // Rabi Crops (October-March, Winter)
  {
    crop_name: "Wheat",
    crop_name_hi: "गेहूं",
    suitable_states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Bihar", "Gujarat", "Maharashtra"],
    suitable_seasons: ["Rabi"],
    suitable_soils: ["Alluvial", "Loamy", "Clay", "Black"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 75,
    min_temp: 10,
    max_temp: 25,
    water_requirement: "medium",
    growth_duration_days: 120
  },
  {
    crop_name: "Chickpea",
    crop_name_hi: "चना",
    suitable_states: ["Madhya Pradesh", "Rajasthan", "Maharashtra", "Uttar Pradesh", "Karnataka", "Andhra Pradesh", "Gujarat"],
    suitable_seasons: ["Rabi"],
    suitable_soils: ["Black", "Alluvial", "Sandy Loam", "Loamy"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 50,
    min_temp: 10,
    max_temp: 30,
    water_requirement: "low",
    growth_duration_days: 100
  },
  {
    crop_name: "Mustard",
    crop_name_hi: "सरसों",
    suitable_states: ["Rajasthan", "Uttar Pradesh", "Haryana", "Madhya Pradesh", "Gujarat", "West Bengal", "Assam"],
    suitable_seasons: ["Rabi"],
    suitable_soils: ["Alluvial", "Sandy Loam", "Loamy", "Clay"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 50,
    min_temp: 10,
    max_temp: 25,
    water_requirement: "low",
    growth_duration_days: 110
  },
  {
    crop_name: "Barley",
    crop_name_hi: "जौ",
    suitable_states: ["Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Haryana", "Punjab", "Bihar"],
    suitable_seasons: ["Rabi"],
    suitable_soils: ["Alluvial", "Sandy Loam", "Loamy"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 50,
    min_temp: 8,
    max_temp: 25,
    water_requirement: "low",
    growth_duration_days: 100
  },
  {
    crop_name: "Lentil",
    crop_name_hi: "मसूर",
    suitable_states: ["Madhya Pradesh", "Uttar Pradesh", "Bihar", "West Bengal", "Rajasthan"],
    suitable_seasons: ["Rabi"],
    suitable_soils: ["Alluvial", "Sandy Loam", "Loamy", "Clay"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 50,
    min_temp: 15,
    max_temp: 28,
    water_requirement: "low",
    growth_duration_days: 110
  },
  {
    crop_name: "Potato",
    crop_name_hi: "आलू",
    suitable_states: ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat", "Madhya Pradesh", "Punjab", "Karnataka"],
    suitable_seasons: ["Rabi"],
    suitable_soils: ["Sandy Loam", "Loamy", "Alluvial"],
    min_rainfall_mm: 30,
    max_rainfall_mm: 50,
    min_temp: 15,
    max_temp: 25,
    water_requirement: "medium",
    growth_duration_days: 90
  },
  {
    crop_name: "Onion",
    crop_name_hi: "प्याज",
    suitable_states: ["Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat", "Bihar", "Rajasthan", "Andhra Pradesh"],
    suitable_seasons: ["Rabi", "Kharif"],
    suitable_soils: ["Alluvial", "Sandy Loam", "Loamy", "Red"],
    min_rainfall_mm: 35,
    max_rainfall_mm: 75,
    min_temp: 13,
    max_temp: 30,
    water_requirement: "medium",
    growth_duration_days: 130
  },
  
  // Zaid Crops (March-June, Summer)
  {
    crop_name: "Watermelon",
    crop_name_hi: "तरबूज",
    suitable_states: ["Uttar Pradesh", "Andhra Pradesh", "Karnataka", "West Bengal", "Odisha", "Maharashtra", "Tamil Nadu"],
    suitable_seasons: ["Zaid"],
    suitable_soils: ["Sandy Loam", "Sandy", "Alluvial"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 50,
    min_temp: 24,
    max_temp: 40,
    water_requirement: "medium",
    growth_duration_days: 90
  },
  {
    crop_name: "Muskmelon",
    crop_name_hi: "खरबूजा",
    suitable_states: ["Uttar Pradesh", "Punjab", "Rajasthan", "Madhya Pradesh", "Gujarat", "Bihar"],
    suitable_seasons: ["Zaid"],
    suitable_soils: ["Sandy Loam", "Sandy", "Loamy"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 50,
    min_temp: 24,
    max_temp: 40,
    water_requirement: "medium",
    growth_duration_days: 85
  },
  {
    crop_name: "Cucumber",
    crop_name_hi: "खीरा",
    suitable_states: ["Karnataka", "Andhra Pradesh", "Tamil Nadu", "Madhya Pradesh", "Uttar Pradesh", "Bihar", "West Bengal"],
    suitable_seasons: ["Zaid", "Kharif"],
    suitable_soils: ["Sandy Loam", "Loamy", "Alluvial"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 50,
    min_temp: 20,
    max_temp: 35,
    water_requirement: "medium",
    growth_duration_days: 60
  },
  {
    crop_name: "Moong Bean",
    crop_name_hi: "मूंग",
    suitable_states: ["Rajasthan", "Maharashtra", "Madhya Pradesh", "Karnataka", "Andhra Pradesh", "Telangana", "Tamil Nadu", "Odisha"],
    suitable_seasons: ["Zaid", "Kharif"],
    suitable_soils: ["Loamy", "Sandy Loam", "Alluvial", "Black"],
    min_rainfall_mm: 25,
    max_rainfall_mm: 60,
    min_temp: 25,
    max_temp: 40,
    water_requirement: "low",
    growth_duration_days: 70
  },
  {
    crop_name: "Bitter Gourd",
    crop_name_hi: "करेला",
    suitable_states: ["Uttar Pradesh", "Maharashtra", "Andhra Pradesh", "Gujarat", "Bihar", "Odisha", "West Bengal"],
    suitable_seasons: ["Zaid", "Kharif"],
    suitable_soils: ["Loamy", "Sandy Loam", "Alluvial"],
    min_rainfall_mm: 30,
    max_rainfall_mm: 60,
    min_temp: 24,
    max_temp: 38,
    water_requirement: "medium",
    growth_duration_days: 90
  }
];

// All Indian states list with translations
export const INDIAN_STATES_DATA: { value: string; en: string; hi: string; te: string }[] = [
  { value: "Andhra Pradesh", en: "Andhra Pradesh", hi: "आंध्र प्रदेश", te: "ఆంధ్ర ప్రదేశ్" },
  { value: "Arunachal Pradesh", en: "Arunachal Pradesh", hi: "अरुणाचल प्रदेश", te: "అరుణాచల్ ప్రదేశ్" },
  { value: "Assam", en: "Assam", hi: "असम", te: "అస్సాం" },
  { value: "Bihar", en: "Bihar", hi: "बिहार", te: "బీహార్" },
  { value: "Chhattisgarh", en: "Chhattisgarh", hi: "छत्तीसगढ़", te: "ఛత్తీస్‌గఢ్" },
  { value: "Goa", en: "Goa", hi: "गोवा", te: "గోవా" },
  { value: "Gujarat", en: "Gujarat", hi: "गुजरात", te: "గుజరాత్" },
  { value: "Haryana", en: "Haryana", hi: "हरियाणा", te: "హర్యానా" },
  { value: "Himachal Pradesh", en: "Himachal Pradesh", hi: "हिमाचल प्रदेश", te: "హిమాచల్ ప్రదేశ్" },
  { value: "Jharkhand", en: "Jharkhand", hi: "झारखंड", te: "జార్ఖండ్" },
  { value: "Karnataka", en: "Karnataka", hi: "कर्नाटक", te: "కర్ణాటక" },
  { value: "Kerala", en: "Kerala", hi: "केरल", te: "కేరళ" },
  { value: "Madhya Pradesh", en: "Madhya Pradesh", hi: "मध्य प्रदेश", te: "మధ్య ప్రదేశ్" },
  { value: "Maharashtra", en: "Maharashtra", hi: "महाराष्ट्र", te: "మహారాష్ట్ర" },
  { value: "Manipur", en: "Manipur", hi: "मणिपुर", te: "మణిపూర్" },
  { value: "Meghalaya", en: "Meghalaya", hi: "मेघालय", te: "మేఘాలయ" },
  { value: "Mizoram", en: "Mizoram", hi: "मिजोरम", te: "మిజోరాం" },
  { value: "Nagaland", en: "Nagaland", hi: "नागालैंड", te: "నాగాలాండ్" },
  { value: "Odisha", en: "Odisha", hi: "ओडिशा", te: "ఒడిశా" },
  { value: "Punjab", en: "Punjab", hi: "पंजाब", te: "పంజాబ్" },
  { value: "Rajasthan", en: "Rajasthan", hi: "राजस्थान", te: "రాజస్థాన్" },
  { value: "Sikkim", en: "Sikkim", hi: "सिक्किम", te: "సిక్కిం" },
  { value: "Tamil Nadu", en: "Tamil Nadu", hi: "तमिलनाडु", te: "తమిళనాడు" },
  { value: "Telangana", en: "Telangana", hi: "तेलंगाना", te: "తెలంగాణ" },
  { value: "Tripura", en: "Tripura", hi: "त्रिपुरा", te: "త్రిపుర" },
  { value: "Uttar Pradesh", en: "Uttar Pradesh", hi: "उत्तर प्रदेश", te: "ఉత్తర ప్రదేశ్" },
  { value: "Uttarakhand", en: "Uttarakhand", hi: "उत्तराखंड", te: "ఉత్తరాఖండ్" },
  { value: "West Bengal", en: "West Bengal", hi: "पश्चिम बंगाल", te: "పశ్చిమ బెంగాల్" }
];

// Legacy export for backward compatibility
export const INDIAN_STATES = INDIAN_STATES_DATA.map(s => s.value);

// Soil types with translations
export const SOIL_TYPES_DATA: { value: string; en: string; hi: string; te: string }[] = [
  { value: "Alluvial", en: "Alluvial", hi: "जलोढ़ मिट्टी", te: "ఒండ్రు నేల" },
  { value: "Black", en: "Black", hi: "काली मिट्टी", te: "నల్ల నేల" },
  { value: "Red", en: "Red", hi: "लाल मिट्टी", te: "ఎర్ర నేల" },
  { value: "Laterite", en: "Laterite", hi: "लैटेराइट मिट्टी", te: "లాటెరైట్ నేల" },
  { value: "Sandy", en: "Sandy", hi: "बलुई मिट्टी", te: "ఇసుక నేల" },
  { value: "Sandy Loam", en: "Sandy Loam", hi: "बलुई दोमट", te: "ఇసుక నేల మిశ్రమం" },
  { value: "Loamy", en: "Loamy", hi: "दोमट मिट्टी", te: "లోమీ నేల" },
  { value: "Clay", en: "Clay", hi: "चिकनी मिट्टी", te: "బంకమట్టి" },
  { value: "Clayey Loam", en: "Clayey Loam", hi: "मटियार दोमट", te: "బంకమట్టి మిశ్రమం" },
  { value: "Mountain", en: "Mountain", hi: "पर्वतीय मिट्टी", te: "పర్వత నేల" }
];

// Legacy export for backward compatibility
export const SOIL_TYPES = SOIL_TYPES_DATA.map(s => s.value);

// Season determination based on month
export function getCurrentSeason(month: number): 'Kharif' | 'Rabi' | 'Zaid' {
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 10 || month <= 3) return 'Rabi';
  return 'Zaid';
}

export function getSeasonName(season: 'Kharif' | 'Rabi' | 'Zaid', language: string = 'en'): string {
  const names = {
    Kharif: { en: 'Kharif (Monsoon)', hi: 'खरीफ (मानसून)', te: 'ఖరీఫ్ (వర్షాకాలం)' },
    Rabi: { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)', te: 'రబీ (శీతాకాలం)' },
    Zaid: { en: 'Zaid (Summer)', hi: 'जायद (गर्मी)', te: 'జైద్ (వేసవి)' }
  };
  return names[season][(language as 'en' | 'hi' | 'te')] || names[season].en;
}

// Helper function to get translated state name
export function getStateName(stateValue: string, language: string = 'en'): string {
  const state = INDIAN_STATES_DATA.find(s => s.value === stateValue);
  if (!state) return stateValue;
  return state[(language as 'en' | 'hi' | 'te')] || state.en;
}

// Helper function to get translated soil type name
export function getSoilTypeName(soilValue: string, language: string = 'en'): string {
  const soil = SOIL_TYPES_DATA.find(s => s.value === soilValue);
  if (!soil) return soilValue;
  return soil[(language as 'en' | 'hi' | 'te')] || soil.en;
}
