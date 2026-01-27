// Crop Calendar for Indian Agriculture
// Maps state + month to allowed crops for sowing

export interface CropCalendarEntry {
  state: string;
  month: number;
  month_name: string;
  recommended_crops: string[];
  season: 'Kharif' | 'Rabi' | 'Zaid';
  activities: string[];
}

// Simplified crop calendar - in production, this would be more detailed
export const CROP_CALENDAR: CropCalendarEntry[] = [
  // Punjab - Major agricultural state
  { state: "Punjab", month: 1, month_name: "January", recommended_crops: ["Wheat", "Mustard", "Potato"], season: "Rabi", activities: ["Irrigation", "Fertilizer application"] },
  { state: "Punjab", month: 2, month_name: "February", recommended_crops: ["Wheat", "Mustard"], season: "Rabi", activities: ["Pest control", "Irrigation"] },
  { state: "Punjab", month: 3, month_name: "March", recommended_crops: ["Wheat", "Potato"], season: "Rabi", activities: ["Harvesting preparation"] },
  { state: "Punjab", month: 4, month_name: "April", recommended_crops: ["Muskmelon", "Watermelon", "Moong Bean"], season: "Zaid", activities: ["Wheat harvesting", "Summer sowing"] },
  { state: "Punjab", month: 5, month_name: "May", recommended_crops: ["Moong Bean", "Muskmelon"], season: "Zaid", activities: ["Land preparation for Kharif"] },
  { state: "Punjab", month: 6, month_name: "June", recommended_crops: ["Rice", "Cotton", "Maize"], season: "Kharif", activities: ["Kharif sowing begins"] },
  { state: "Punjab", month: 7, month_name: "July", recommended_crops: ["Rice", "Cotton", "Sugarcane"], season: "Kharif", activities: ["Transplanting", "Weeding"] },
  { state: "Punjab", month: 8, month_name: "August", recommended_crops: ["Rice", "Cotton"], season: "Kharif", activities: ["Pest control", "Irrigation"] },
  { state: "Punjab", month: 9, month_name: "September", recommended_crops: ["Rice", "Cotton"], season: "Kharif", activities: ["Fertilizer application"] },
  { state: "Punjab", month: 10, month_name: "October", recommended_crops: ["Wheat", "Mustard", "Chickpea"], season: "Rabi", activities: ["Kharif harvesting", "Rabi sowing"] },
  { state: "Punjab", month: 11, month_name: "November", recommended_crops: ["Wheat", "Mustard", "Barley"], season: "Rabi", activities: ["Rabi sowing continues"] },
  { state: "Punjab", month: 12, month_name: "December", recommended_crops: ["Wheat", "Mustard", "Potato"], season: "Rabi", activities: ["Irrigation", "Fertilizer"] },

  // Maharashtra - Diverse agricultural state
  { state: "Maharashtra", month: 1, month_name: "January", recommended_crops: ["Wheat", "Chickpea", "Onion"], season: "Rabi", activities: ["Rabi crop care"] },
  { state: "Maharashtra", month: 2, month_name: "February", recommended_crops: ["Wheat", "Chickpea"], season: "Rabi", activities: ["Harvesting preparation"] },
  { state: "Maharashtra", month: 3, month_name: "March", recommended_crops: ["Watermelon", "Muskmelon", "Cucumber"], season: "Zaid", activities: ["Rabi harvesting", "Summer sowing"] },
  { state: "Maharashtra", month: 4, month_name: "April", recommended_crops: ["Moong Bean", "Bitter Gourd"], season: "Zaid", activities: ["Summer crop care"] },
  { state: "Maharashtra", month: 5, month_name: "May", recommended_crops: ["Moong Bean"], season: "Zaid", activities: ["Land preparation"] },
  { state: "Maharashtra", month: 6, month_name: "June", recommended_crops: ["Cotton", "Soybean", "Sorghum", "Rice"], season: "Kharif", activities: ["Kharif sowing"] },
  { state: "Maharashtra", month: 7, month_name: "July", recommended_crops: ["Cotton", "Soybean", "Pearl Millet", "Groundnut"], season: "Kharif", activities: ["Sowing continues"] },
  { state: "Maharashtra", month: 8, month_name: "August", recommended_crops: ["Cotton", "Soybean"], season: "Kharif", activities: ["Weeding", "Pest control"] },
  { state: "Maharashtra", month: 9, month_name: "September", recommended_crops: ["Cotton", "Soybean", "Onion"], season: "Kharif", activities: ["Kharif crop care"] },
  { state: "Maharashtra", month: 10, month_name: "October", recommended_crops: ["Wheat", "Chickpea", "Onion"], season: "Rabi", activities: ["Kharif harvesting", "Rabi sowing"] },
  { state: "Maharashtra", month: 11, month_name: "November", recommended_crops: ["Wheat", "Chickpea", "Onion"], season: "Rabi", activities: ["Rabi sowing"] },
  { state: "Maharashtra", month: 12, month_name: "December", recommended_crops: ["Wheat", "Chickpea"], season: "Rabi", activities: ["Irrigation"] },

  // Uttar Pradesh - Largest agricultural state
  { state: "Uttar Pradesh", month: 1, month_name: "January", recommended_crops: ["Wheat", "Mustard", "Potato", "Lentil"], season: "Rabi", activities: ["Winter crop care"] },
  { state: "Uttar Pradesh", month: 2, month_name: "February", recommended_crops: ["Wheat", "Mustard", "Potato"], season: "Rabi", activities: ["Irrigation", "Fertilizer"] },
  { state: "Uttar Pradesh", month: 3, month_name: "March", recommended_crops: ["Watermelon", "Muskmelon", "Cucumber"], season: "Zaid", activities: ["Harvesting", "Summer sowing"] },
  { state: "Uttar Pradesh", month: 4, month_name: "April", recommended_crops: ["Moong Bean", "Bitter Gourd", "Watermelon"], season: "Zaid", activities: ["Wheat harvesting"] },
  { state: "Uttar Pradesh", month: 5, month_name: "May", recommended_crops: ["Moong Bean", "Bitter Gourd"], season: "Zaid", activities: ["Land preparation"] },
  { state: "Uttar Pradesh", month: 6, month_name: "June", recommended_crops: ["Rice", "Maize", "Sugarcane"], season: "Kharif", activities: ["Kharif sowing"] },
  { state: "Uttar Pradesh", month: 7, month_name: "July", recommended_crops: ["Rice", "Maize", "Sugarcane", "Pearl Millet"], season: "Kharif", activities: ["Transplanting"] },
  { state: "Uttar Pradesh", month: 8, month_name: "August", recommended_crops: ["Rice", "Sugarcane"], season: "Kharif", activities: ["Weeding", "Pest control"] },
  { state: "Uttar Pradesh", month: 9, month_name: "September", recommended_crops: ["Rice", "Sugarcane"], season: "Kharif", activities: ["Crop care"] },
  { state: "Uttar Pradesh", month: 10, month_name: "October", recommended_crops: ["Wheat", "Mustard", "Potato", "Lentil"], season: "Rabi", activities: ["Rabi sowing begins"] },
  { state: "Uttar Pradesh", month: 11, month_name: "November", recommended_crops: ["Wheat", "Mustard", "Potato", "Barley"], season: "Rabi", activities: ["Rabi sowing"] },
  { state: "Uttar Pradesh", month: 12, month_name: "December", recommended_crops: ["Wheat", "Mustard", "Potato"], season: "Rabi", activities: ["Winter care"] },

  // Rajasthan - Arid region
  { state: "Rajasthan", month: 1, month_name: "January", recommended_crops: ["Wheat", "Mustard", "Chickpea", "Barley"], season: "Rabi", activities: ["Irrigation"] },
  { state: "Rajasthan", month: 2, month_name: "February", recommended_crops: ["Wheat", "Mustard", "Chickpea"], season: "Rabi", activities: ["Fertilizer application"] },
  { state: "Rajasthan", month: 3, month_name: "March", recommended_crops: ["Muskmelon", "Watermelon", "Moong Bean"], season: "Zaid", activities: ["Harvesting"] },
  { state: "Rajasthan", month: 4, month_name: "April", recommended_crops: ["Moong Bean", "Muskmelon"], season: "Zaid", activities: ["Summer sowing"] },
  { state: "Rajasthan", month: 5, month_name: "May", recommended_crops: ["Moong Bean"], season: "Zaid", activities: ["Land preparation"] },
  { state: "Rajasthan", month: 6, month_name: "June", recommended_crops: ["Pearl Millet", "Sorghum", "Maize"], season: "Kharif", activities: ["Kharif sowing"] },
  { state: "Rajasthan", month: 7, month_name: "July", recommended_crops: ["Pearl Millet", "Sorghum", "Cotton", "Groundnut"], season: "Kharif", activities: ["Monsoon sowing"] },
  { state: "Rajasthan", month: 8, month_name: "August", recommended_crops: ["Pearl Millet", "Sorghum"], season: "Kharif", activities: ["Weeding"] },
  { state: "Rajasthan", month: 9, month_name: "September", recommended_crops: ["Pearl Millet"], season: "Kharif", activities: ["Pest control"] },
  { state: "Rajasthan", month: 10, month_name: "October", recommended_crops: ["Wheat", "Mustard", "Chickpea"], season: "Rabi", activities: ["Rabi sowing"] },
  { state: "Rajasthan", month: 11, month_name: "November", recommended_crops: ["Wheat", "Mustard", "Barley", "Chickpea"], season: "Rabi", activities: ["Sowing continues"] },
  { state: "Rajasthan", month: 12, month_name: "December", recommended_crops: ["Wheat", "Mustard", "Barley"], season: "Rabi", activities: ["Winter irrigation"] },

  // Karnataka - Mixed agriculture
  { state: "Karnataka", month: 1, month_name: "January", recommended_crops: ["Rice", "Maize", "Groundnut"], season: "Rabi", activities: ["Rabi care"] },
  { state: "Karnataka", month: 2, month_name: "February", recommended_crops: ["Maize", "Groundnut"], season: "Rabi", activities: ["Irrigation"] },
  { state: "Karnataka", month: 3, month_name: "March", recommended_crops: ["Watermelon", "Cucumber", "Moong Bean"], season: "Zaid", activities: ["Summer sowing"] },
  { state: "Karnataka", month: 4, month_name: "April", recommended_crops: ["Moong Bean", "Cucumber", "Bitter Gourd"], season: "Zaid", activities: ["Land preparation"] },
  { state: "Karnataka", month: 5, month_name: "May", recommended_crops: ["Moong Bean"], season: "Zaid", activities: ["Pre-monsoon preparation"] },
  { state: "Karnataka", month: 6, month_name: "June", recommended_crops: ["Rice", "Maize", "Cotton", "Sorghum"], season: "Kharif", activities: ["Kharif sowing"] },
  { state: "Karnataka", month: 7, month_name: "July", recommended_crops: ["Rice", "Maize", "Cotton", "Sugarcane"], season: "Kharif", activities: ["Monsoon sowing"] },
  { state: "Karnataka", month: 8, month_name: "August", recommended_crops: ["Rice", "Cotton", "Soybean"], season: "Kharif", activities: ["Crop care"] },
  { state: "Karnataka", month: 9, month_name: "September", recommended_crops: ["Rice", "Cotton", "Onion"], season: "Kharif", activities: ["Pest management"] },
  { state: "Karnataka", month: 10, month_name: "October", recommended_crops: ["Chickpea", "Onion", "Potato"], season: "Rabi", activities: ["Rabi sowing"] },
  { state: "Karnataka", month: 11, month_name: "November", recommended_crops: ["Chickpea", "Onion", "Maize"], season: "Rabi", activities: ["Rabi continues"] },
  { state: "Karnataka", month: 12, month_name: "December", recommended_crops: ["Maize", "Potato", "Groundnut"], season: "Rabi", activities: ["Irrigation"] },
];

// Get recommended crops for a state and month
export function getRecommendedCrops(state: string, month: number): string[] {
  const entry = CROP_CALENDAR.find(c => c.state === state && c.month === month);
  if (entry) return entry.recommended_crops;
  
  // Fallback: return crops based on season only
  const season = getSeasonFromMonth(month);
  const seasonEntries = CROP_CALENDAR.filter(c => c.month === month);
  const allCrops = seasonEntries.flatMap(e => e.recommended_crops);
  return [...new Set(allCrops)];
}

function getSeasonFromMonth(month: number): 'Kharif' | 'Rabi' | 'Zaid' {
  if (month >= 6 && month <= 10) return 'Kharif';
  if (month >= 10 || month <= 3) return 'Rabi';
  return 'Zaid';
}

// Get activities for current period
export function getCurrentActivities(state: string, month: number): string[] {
  const entry = CROP_CALENDAR.find(c => c.state === state && c.month === month);
  return entry?.activities || ["General farm maintenance"];
}
