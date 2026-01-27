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

// All Indian states list
export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

// Soil types in India
export const SOIL_TYPES = [
  "Alluvial",
  "Black",
  "Red",
  "Laterite",
  "Sandy",
  "Sandy Loam",
  "Loamy",
  "Clay",
  "Clayey Loam",
  "Mountain"
];

// Season determination based on month
export function getCurrentSeason(month: number): 'Kharif' | 'Rabi' | 'Zaid' {
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 10 || month <= 3) return 'Rabi';
  return 'Zaid';
}

export function getSeasonName(season: 'Kharif' | 'Rabi' | 'Zaid', language: string = 'en'): string {
  const names = {
    Kharif: { en: 'Kharif (Monsoon)', hi: 'खरीफ (मानसून)' },
    Rabi: { en: 'Rabi (Winter)', hi: 'रबी (सर्दी)' },
    Zaid: { en: 'Zaid (Summer)', hi: 'जायद (गर्मी)' }
  };
  return names[season][language === 'hi' ? 'hi' : 'en'];
}
