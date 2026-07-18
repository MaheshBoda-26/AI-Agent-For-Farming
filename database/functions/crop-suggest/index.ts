import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ============ DATA TYPES ============
interface CropData {
  crop_name: string;
  crop_name_hi: string;
  suitable_states: string[];
  suitable_seasons: string[];
  suitable_soils: string[];
  min_rainfall_mm: number;
  max_rainfall_mm: number;
  min_temp: number;
  max_temp: number;
  water_requirement: string;
  growth_duration_days: number;
}

interface SoilCompatibility {
  soil_type: string;
  best_crops: string[];
  suitable_crops: string[];
}

interface CropSuggestion {
  name: string;
  name_hi: string;
  reasons: string[];
  risk: string;
  confidence: number;
}

interface RequestInput {
  state: string;
  district?: string;
  month: number;
  season: string;
  soil_type: string;
  avg_temp?: number;
  rainfall_forecast_mm?: number;
  language?: string;
}

// ============ CROP DATABASE ============
const CROPS_DATABASE: CropData[] = [
  // Kharif Crops
  { crop_name: "Rice", crop_name_hi: "धान", suitable_states: ["Andhra Pradesh", "Telangana", "West Bengal", "Punjab", "Uttar Pradesh", "Bihar", "Tamil Nadu", "Odisha", "Karnataka", "Assam", "Haryana", "Madhya Pradesh", "Chhattisgarh", "Kerala", "Maharashtra"], suitable_seasons: ["Kharif"], suitable_soils: ["Alluvial", "Clay", "Clayey Loam"], min_rainfall_mm: 100, max_rainfall_mm: 200, min_temp: 20, max_temp: 35, water_requirement: "high", growth_duration_days: 120 },
  { crop_name: "Cotton", crop_name_hi: "कपास", suitable_states: ["Gujarat", "Maharashtra", "Telangana", "Andhra Pradesh", "Karnataka", "Madhya Pradesh", "Rajasthan", "Punjab", "Haryana"], suitable_seasons: ["Kharif"], suitable_soils: ["Black", "Alluvial", "Sandy Loam"], min_rainfall_mm: 50, max_rainfall_mm: 100, min_temp: 21, max_temp: 35, water_requirement: "medium", growth_duration_days: 180 },
  { crop_name: "Maize", crop_name_hi: "मक्का", suitable_states: ["Karnataka", "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Bihar", "Rajasthan", "Maharashtra", "Uttar Pradesh", "Gujarat", "Tamil Nadu"], suitable_seasons: ["Kharif", "Rabi"], suitable_soils: ["Alluvial", "Red", "Sandy Loam", "Loamy"], min_rainfall_mm: 50, max_rainfall_mm: 100, min_temp: 18, max_temp: 32, water_requirement: "medium", growth_duration_days: 100 },
  { crop_name: "Sorghum", crop_name_hi: "ज्वार", suitable_states: ["Maharashtra", "Karnataka", "Andhra Pradesh", "Telangana", "Madhya Pradesh", "Rajasthan", "Gujarat", "Tamil Nadu"], suitable_seasons: ["Kharif", "Rabi"], suitable_soils: ["Black", "Red", "Alluvial", "Sandy Loam"], min_rainfall_mm: 40, max_rainfall_mm: 100, min_temp: 20, max_temp: 40, water_requirement: "low", growth_duration_days: 110 },
  { crop_name: "Pearl Millet", crop_name_hi: "बाजरा", suitable_states: ["Rajasthan", "Maharashtra", "Gujarat", "Uttar Pradesh", "Haryana", "Karnataka", "Madhya Pradesh", "Tamil Nadu"], suitable_seasons: ["Kharif"], suitable_soils: ["Sandy", "Sandy Loam", "Alluvial", "Red"], min_rainfall_mm: 25, max_rainfall_mm: 60, min_temp: 25, max_temp: 42, water_requirement: "low", growth_duration_days: 90 },
  { crop_name: "Groundnut", crop_name_hi: "मूंगफली", suitable_states: ["Gujarat", "Andhra Pradesh", "Tamil Nadu", "Karnataka", "Rajasthan", "Maharashtra", "Madhya Pradesh"], suitable_seasons: ["Kharif", "Rabi"], suitable_soils: ["Sandy Loam", "Red", "Alluvial", "Loamy"], min_rainfall_mm: 50, max_rainfall_mm: 125, min_temp: 20, max_temp: 35, water_requirement: "medium", growth_duration_days: 120 },
  { crop_name: "Soybean", crop_name_hi: "सोयाबीन", suitable_states: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Telangana"], suitable_seasons: ["Kharif"], suitable_soils: ["Black", "Alluvial", "Clay", "Loamy"], min_rainfall_mm: 60, max_rainfall_mm: 100, min_temp: 20, max_temp: 32, water_requirement: "medium", growth_duration_days: 100 },
  { crop_name: "Sugarcane", crop_name_hi: "गन्ना", suitable_states: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Gujarat", "Bihar", "Andhra Pradesh", "Punjab", "Haryana"], suitable_seasons: ["Kharif"], suitable_soils: ["Alluvial", "Black", "Loamy", "Clay"], min_rainfall_mm: 75, max_rainfall_mm: 150, min_temp: 20, max_temp: 38, water_requirement: "high", growth_duration_days: 365 },
  // Rabi Crops
  { crop_name: "Wheat", crop_name_hi: "गेहूं", suitable_states: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Rajasthan", "Bihar", "Gujarat", "Maharashtra"], suitable_seasons: ["Rabi"], suitable_soils: ["Alluvial", "Loamy", "Clay", "Black"], min_rainfall_mm: 25, max_rainfall_mm: 75, min_temp: 10, max_temp: 25, water_requirement: "medium", growth_duration_days: 120 },
  { crop_name: "Chickpea", crop_name_hi: "चना", suitable_states: ["Madhya Pradesh", "Rajasthan", "Maharashtra", "Uttar Pradesh", "Karnataka", "Andhra Pradesh", "Gujarat"], suitable_seasons: ["Rabi"], suitable_soils: ["Black", "Alluvial", "Sandy Loam", "Loamy"], min_rainfall_mm: 25, max_rainfall_mm: 50, min_temp: 10, max_temp: 30, water_requirement: "low", growth_duration_days: 100 },
  { crop_name: "Mustard", crop_name_hi: "सरसों", suitable_states: ["Rajasthan", "Uttar Pradesh", "Haryana", "Madhya Pradesh", "Gujarat", "West Bengal", "Assam"], suitable_seasons: ["Rabi"], suitable_soils: ["Alluvial", "Sandy Loam", "Loamy", "Clay"], min_rainfall_mm: 25, max_rainfall_mm: 50, min_temp: 10, max_temp: 25, water_requirement: "low", growth_duration_days: 110 },
  { crop_name: "Barley", crop_name_hi: "जौ", suitable_states: ["Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Haryana", "Punjab", "Bihar"], suitable_seasons: ["Rabi"], suitable_soils: ["Alluvial", "Sandy Loam", "Loamy"], min_rainfall_mm: 25, max_rainfall_mm: 50, min_temp: 8, max_temp: 25, water_requirement: "low", growth_duration_days: 100 },
  { crop_name: "Lentil", crop_name_hi: "मसूर", suitable_states: ["Madhya Pradesh", "Uttar Pradesh", "Bihar", "West Bengal", "Rajasthan"], suitable_seasons: ["Rabi"], suitable_soils: ["Alluvial", "Sandy Loam", "Loamy", "Clay"], min_rainfall_mm: 25, max_rainfall_mm: 50, min_temp: 15, max_temp: 28, water_requirement: "low", growth_duration_days: 110 },
  { crop_name: "Potato", crop_name_hi: "आलू", suitable_states: ["Uttar Pradesh", "West Bengal", "Bihar", "Gujarat", "Madhya Pradesh", "Punjab", "Karnataka"], suitable_seasons: ["Rabi"], suitable_soils: ["Sandy Loam", "Loamy", "Alluvial"], min_rainfall_mm: 30, max_rainfall_mm: 50, min_temp: 15, max_temp: 25, water_requirement: "medium", growth_duration_days: 90 },
  { crop_name: "Onion", crop_name_hi: "प्याज", suitable_states: ["Maharashtra", "Karnataka", "Madhya Pradesh", "Gujarat", "Bihar", "Rajasthan", "Andhra Pradesh"], suitable_seasons: ["Rabi", "Kharif"], suitable_soils: ["Alluvial", "Sandy Loam", "Loamy", "Red"], min_rainfall_mm: 35, max_rainfall_mm: 75, min_temp: 13, max_temp: 30, water_requirement: "medium", growth_duration_days: 130 },
  // Zaid Crops
  { crop_name: "Watermelon", crop_name_hi: "तरबूज", suitable_states: ["Uttar Pradesh", "Andhra Pradesh", "Karnataka", "West Bengal", "Odisha", "Maharashtra", "Tamil Nadu"], suitable_seasons: ["Zaid"], suitable_soils: ["Sandy Loam", "Sandy", "Alluvial"], min_rainfall_mm: 25, max_rainfall_mm: 50, min_temp: 24, max_temp: 40, water_requirement: "medium", growth_duration_days: 90 },
  { crop_name: "Muskmelon", crop_name_hi: "खरबूजा", suitable_states: ["Uttar Pradesh", "Punjab", "Rajasthan", "Madhya Pradesh", "Gujarat", "Bihar"], suitable_seasons: ["Zaid"], suitable_soils: ["Sandy Loam", "Sandy", "Loamy"], min_rainfall_mm: 25, max_rainfall_mm: 50, min_temp: 24, max_temp: 40, water_requirement: "medium", growth_duration_days: 85 },
  { crop_name: "Cucumber", crop_name_hi: "खीरा", suitable_states: ["Karnataka", "Andhra Pradesh", "Tamil Nadu", "Madhya Pradesh", "Uttar Pradesh", "Bihar", "West Bengal"], suitable_seasons: ["Zaid", "Kharif"], suitable_soils: ["Sandy Loam", "Loamy", "Alluvial"], min_rainfall_mm: 25, max_rainfall_mm: 50, min_temp: 20, max_temp: 35, water_requirement: "medium", growth_duration_days: 60 },
  { crop_name: "Moong Bean", crop_name_hi: "मूंग", suitable_states: ["Rajasthan", "Maharashtra", "Madhya Pradesh", "Karnataka", "Andhra Pradesh", "Telangana", "Tamil Nadu", "Odisha"], suitable_seasons: ["Zaid", "Kharif"], suitable_soils: ["Loamy", "Sandy Loam", "Alluvial", "Black"], min_rainfall_mm: 25, max_rainfall_mm: 60, min_temp: 25, max_temp: 40, water_requirement: "low", growth_duration_days: 70 },
  { crop_name: "Bitter Gourd", crop_name_hi: "करेला", suitable_states: ["Uttar Pradesh", "Maharashtra", "Andhra Pradesh", "Gujarat", "Bihar", "Odisha", "West Bengal"], suitable_seasons: ["Zaid", "Kharif"], suitable_soils: ["Loamy", "Sandy Loam", "Alluvial"], min_rainfall_mm: 30, max_rainfall_mm: 60, min_temp: 24, max_temp: 38, water_requirement: "medium", growth_duration_days: 90 },
];

// ============ SOIL COMPATIBILITY ============
const SOIL_COMPATIBILITY: SoilCompatibility[] = [
  { soil_type: "Alluvial", best_crops: ["Rice", "Wheat", "Sugarcane", "Maize", "Potato"], suitable_crops: ["Cotton", "Groundnut", "Mustard", "Onion", "Cucumber", "Lentil", "Barley", "Moong Bean"] },
  { soil_type: "Black", best_crops: ["Cotton", "Soybean", "Sorghum", "Chickpea"], suitable_crops: ["Wheat", "Sugarcane", "Groundnut", "Moong Bean"] },
  { soil_type: "Red", best_crops: ["Pearl Millet", "Sorghum", "Groundnut"], suitable_crops: ["Maize", "Onion", "Potato"] },
  { soil_type: "Laterite", best_crops: ["Rice"], suitable_crops: ["Sugarcane"] },
  { soil_type: "Sandy", best_crops: ["Pearl Millet", "Watermelon", "Muskmelon"], suitable_crops: ["Groundnut", "Moong Bean"] },
  { soil_type: "Sandy Loam", best_crops: ["Potato", "Groundnut", "Watermelon", "Cucumber"], suitable_crops: ["Cotton", "Maize", "Mustard", "Barley", "Onion", "Muskmelon", "Bitter Gourd", "Pearl Millet", "Chickpea", "Moong Bean"] },
  { soil_type: "Loamy", best_crops: ["Wheat", "Maize", "Potato", "Onion"], suitable_crops: ["Rice", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Barley", "Lentil", "Cucumber", "Moong Bean", "Bitter Gourd", "Muskmelon"] },
  { soil_type: "Clay", best_crops: ["Rice", "Soybean"], suitable_crops: ["Wheat", "Sugarcane", "Mustard", "Lentil"] },
  { soil_type: "Clayey Loam", best_crops: ["Rice", "Wheat"], suitable_crops: ["Sugarcane", "Soybean"] },
  { soil_type: "Mountain", best_crops: ["Potato", "Maize"], suitable_crops: ["Barley", "Wheat"] },
];

// ============ VALID INPUTS ============
const VALID_STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"];
const VALID_SOILS = ["Alluvial", "Black", "Red", "Laterite", "Sandy", "Sandy Loam", "Loamy", "Clay", "Clayey Loam", "Mountain"];
const VALID_SEASONS = ["Kharif", "Rabi", "Zaid"];

// ============ VALIDATION ============
function validateInput(input: RequestInput): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.state || !VALID_STATES.includes(input.state)) {
    errors.push(`Invalid state. Must be one of: ${VALID_STATES.slice(0, 5).join(", ")}...`);
  }
  if (!input.month || input.month < 1 || input.month > 12) {
    errors.push("Invalid month. Must be between 1 and 12.");
  }
  if (!input.season || !VALID_SEASONS.includes(input.season)) {
    errors.push(`Invalid season. Must be one of: ${VALID_SEASONS.join(", ")}`);
  }
  if (!input.soil_type || !VALID_SOILS.includes(input.soil_type)) {
    errors.push(`Invalid soil_type. Must be one of: ${VALID_SOILS.join(", ")}`);
  }

  return { valid: errors.length === 0, errors };
}

// ============ RULE ENGINE ============
interface RuleResult {
  crop: CropData;
  passed: boolean;
  failedRules: string[];
  passedRules: string[];
}

function applyRules(
  crop: CropData,
  input: RequestInput,
  soilCompat: SoilCompatibility | undefined
): RuleResult {
  const failedRules: string[] = [];
  const passedRules: string[] = [];

  // Rule 1: Season match
  if (crop.suitable_seasons.includes(input.season)) {
    passedRules.push(`Suitable for ${input.season} season`);
  } else {
    failedRules.push(`Not suitable for ${input.season} season`);
  }

  // Rule 2: State match
  if (crop.suitable_states.includes(input.state)) {
    passedRules.push(`Grown successfully in ${input.state}`);
  } else {
    failedRules.push(`Not commonly grown in ${input.state}`);
  }

  // Rule 3: Soil match
  if (soilCompat) {
    if (soilCompat.best_crops.includes(crop.crop_name)) {
      passedRules.push(`${input.soil_type} soil is ideal for this crop`);
    } else if (soilCompat.suitable_crops.includes(crop.crop_name)) {
      passedRules.push(`${input.soil_type} soil is suitable for this crop`);
    } else if (crop.suitable_soils.includes(input.soil_type)) {
      passedRules.push(`Can grow in ${input.soil_type} soil`);
    } else {
      failedRules.push(`${input.soil_type} soil is not suitable`);
    }
  }

  // Rule 4: Temperature check (if provided)
  if (input.avg_temp !== undefined) {
    if (input.avg_temp >= crop.min_temp && input.avg_temp <= crop.max_temp) {
      passedRules.push(`Current temperature (${input.avg_temp}°C) is within optimal range`);
    } else if (input.avg_temp < crop.min_temp) {
      failedRules.push(`Temperature too low (needs ${crop.min_temp}°C+)`);
    } else {
      failedRules.push(`Temperature too high (needs below ${crop.max_temp}°C)`);
    }
  }

  // Rule 5: Rainfall check (if provided)
  if (input.rainfall_forecast_mm !== undefined) {
    if (input.rainfall_forecast_mm >= crop.min_rainfall_mm && input.rainfall_forecast_mm <= crop.max_rainfall_mm) {
      passedRules.push(`Expected rainfall matches crop requirements`);
    } else if (input.rainfall_forecast_mm < crop.min_rainfall_mm) {
      failedRules.push(`Insufficient rainfall expected (needs ${crop.min_rainfall_mm}mm+)`);
    } else {
      failedRules.push(`Excessive rainfall expected (max ${crop.max_rainfall_mm}mm)`);
    }
  }

  return {
    crop,
    passed: failedRules.length === 0,
    failedRules,
    passedRules,
  };
}

// ============ ML-LIKE SCORING ============
function calculateSuitabilityScore(
  crop: CropData,
  input: RequestInput,
  ruleResult: RuleResult,
  soilCompat: SoilCompatibility | undefined
): number {
  let score = 0.5; // Base score

  // Scoring weights
  const weights = {
    season: 0.25,
    state: 0.20,
    soil: 0.20,
    temperature: 0.15,
    rainfall: 0.15,
    rules: 0.05,
  };

  // Season score
  if (crop.suitable_seasons.includes(input.season)) {
    score += weights.season;
  }

  // State score
  if (crop.suitable_states.includes(input.state)) {
    score += weights.state;
  }

  // Soil score
  if (soilCompat) {
    if (soilCompat.best_crops.includes(crop.crop_name)) {
      score += weights.soil;
    } else if (soilCompat.suitable_crops.includes(crop.crop_name)) {
      score += weights.soil * 0.7;
    } else if (crop.suitable_soils.includes(input.soil_type)) {
      score += weights.soil * 0.4;
    }
  }

  // Temperature score (if available)
  if (input.avg_temp !== undefined) {
    const tempRange = crop.max_temp - crop.min_temp;
    const optimalTemp = (crop.min_temp + crop.max_temp) / 2;
    const tempDiff = Math.abs(input.avg_temp - optimalTemp);
    const tempScore = Math.max(0, 1 - (tempDiff / tempRange));
    score += weights.temperature * tempScore;
  } else {
    score += weights.temperature * 0.5; // Neutral if not provided
  }

  // Rainfall score (if available)
  if (input.rainfall_forecast_mm !== undefined) {
    const rainfallRange = crop.max_rainfall_mm - crop.min_rainfall_mm;
    const optimalRainfall = (crop.min_rainfall_mm + crop.max_rainfall_mm) / 2;
    const rainfallDiff = Math.abs(input.rainfall_forecast_mm - optimalRainfall);
    const rainfallScore = Math.max(0, 1 - (rainfallDiff / rainfallRange));
    score += weights.rainfall * rainfallScore;
  } else {
    score += weights.rainfall * 0.5; // Neutral if not provided
  }

  // Bonus for passing all rules
  if (ruleResult.passed) {
    score += weights.rules;
  }

  // Cap score between 0 and 1
  return Math.min(1, Math.max(0, score));
}

// ============ RISK ASSESSMENT ============
function assessRisk(
  crop: CropData,
  input: RequestInput,
  ruleResult: RuleResult,
  isHindi: boolean
): string {
  const risks: string[] = [];

  // Weather risks
  if (input.avg_temp !== undefined) {
    if (input.avg_temp > crop.max_temp - 3) {
      risks.push(isHindi ? "अधिक तापमान का जोखिम" : "High temperature stress risk");
    }
    if (input.avg_temp < crop.min_temp + 3) {
      risks.push(isHindi ? "कम तापमान का जोखिम" : "Cold stress risk");
    }
  }

  if (input.rainfall_forecast_mm !== undefined) {
    if (input.rainfall_forecast_mm > crop.max_rainfall_mm * 0.8) {
      risks.push(isHindi ? "जलभराव का खतरा" : "Waterlogging risk");
    }
    if (input.rainfall_forecast_mm < crop.min_rainfall_mm * 1.2) {
      risks.push(isHindi ? "सूखे का खतरा" : "Drought stress possible");
    }
  }

  // Water requirement risk
  if (crop.water_requirement === "high" && input.rainfall_forecast_mm !== undefined && input.rainfall_forecast_mm < 80) {
    risks.push(isHindi ? "अतिरिक्त सिंचाई की आवश्यकता" : "Additional irrigation needed");
  }

  // State compatibility
  if (!crop.suitable_states.includes(input.state)) {
    risks.push(isHindi ? "इस क्षेत्र में कम प्रचलित" : "Less common in this region");
  }

  if (risks.length === 0) {
    return isHindi ? "कोई महत्वपूर्ण जोखिम नहीं" : "No significant risks identified";
  }

  return risks.join("; ");
}

// ============ MAIN SUGGESTION ENGINE ============
function suggestCrops(input: RequestInput): { crops: CropSuggestion[]; message?: string } {
  const isHindi = input.language === "hi";
  const soilCompat = SOIL_COMPATIBILITY.find((s) => s.soil_type === input.soil_type);

  // Apply rule engine to all crops
  const ruleResults = CROPS_DATABASE.map((crop) => ({
    ...applyRules(crop, input, soilCompat),
    score: 0,
  }));

  // Filter crops that pass critical rules (season + at least 2 other rules)
  const filteredResults = ruleResults.filter((r) => {
    const seasonPassed = r.crop.suitable_seasons.includes(input.season);
    return seasonPassed && r.failedRules.length <= 2;
  });

  if (filteredResults.length === 0) {
    return {
      crops: [],
      message: isHindi
        ? "आपकी शर्तों के अनुसार कोई उपयुक्त फसल नहीं मिली। कृपया अपने नजदीकी कृषि विज्ञान केंद्र से संपर्क करें।"
        : "No suitable crops found for your conditions. Please contact your local Krishi Vigyan Kendra for guidance.",
    };
  }

  // Calculate suitability scores
  const scoredResults = filteredResults.map((r) => ({
    ...r,
    score: calculateSuitabilityScore(r.crop, input, r, soilCompat),
  }));

  // Sort by score and take top 3
  const topCrops = scoredResults
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Build suggestions
  const suggestions: CropSuggestion[] = topCrops.map((result) => ({
    name: result.crop.crop_name,
    name_hi: result.crop.crop_name_hi,
    reasons: result.passedRules.slice(0, 3),
    risk: assessRisk(result.crop, input, result, isHindi),
    confidence: Math.round(result.score * 100),
  }));

  return { crops: suggestions };
}

// ============ HTTP HANDLER ============
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: RequestInput = await req.json();

    // Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          error: "Validation failed",
          errors: validation.errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get crop suggestions
    const result = suggestCrops(input);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("crop-suggest error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
