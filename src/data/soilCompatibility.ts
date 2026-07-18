// Soil Compatibility Table for Indian Agriculture
// Maps soil type to allowed crops with compatibility scores

export interface SoilCropCompatibility {
  soil_type: string;
  soil_type_hi: string;
  description: string;
  description_hi: string;
  best_crops: string[];
  suitable_crops: string[];
  regions: string[];
}

export const SOIL_COMPATIBILITY: SoilCropCompatibility[] = [
  {
    soil_type: "Alluvial",
    soil_type_hi: "जलोढ़",
    description: "Most fertile soil, found in river basins. Rich in potash but poor in nitrogen.",
    description_hi: "सबसे उपजाऊ मिट्टी, नदी घाटियों में पाई जाती है। पोटाश से समृद्ध लेकिन नाइट्रोजन में कमी।",
    best_crops: ["Rice", "Wheat", "Sugarcane", "Maize", "Potato"],
    suitable_crops: ["Cotton", "Groundnut", "Mustard", "Onion", "Cucumber", "Lentil", "Barley", "Moong Bean"],
    regions: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar", "West Bengal", "Assam"]
  },
  {
    soil_type: "Black",
    soil_type_hi: "काली मिट्टी",
    description: "Also called Regur soil. Rich in calcium, magnesium, potash. Ideal for cotton.",
    description_hi: "रेगुर मिट्टी भी कहा जाता है। कैल्शियम, मैग्नीशियम, पोटाश से समृद्ध। कपास के लिए आदर्श।",
    best_crops: ["Cotton", "Soybean", "Sorghum", "Chickpea"],
    suitable_crops: ["Wheat", "Sugarcane", "Groundnut", "Moong Bean"],
    regions: ["Maharashtra", "Gujarat", "Madhya Pradesh", "Karnataka", "Andhra Pradesh", "Telangana"]
  },
  {
    soil_type: "Red",
    soil_type_hi: "लाल मिट्टी",
    description: "Rich in iron, poor in nitrogen and phosphorus. Good for millets and pulses.",
    description_hi: "लोहे से समृद्ध, नाइट्रोजन और फास्फोरस में कमी। बाजरा और दालों के लिए अच्छी।",
    best_crops: ["Pearl Millet", "Sorghum", "Groundnut"],
    suitable_crops: ["Maize", "Onion", "Potato"],
    regions: ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Odisha", "Jharkhand", "Chhattisgarh"]
  },
  {
    soil_type: "Laterite",
    soil_type_hi: "लेटराइट",
    description: "Formed in high rainfall areas. Acidic, low in nutrients. Good for plantation crops.",
    description_hi: "उच्च वर्षा वाले क्षेत्रों में बनती है। अम्लीय, पोषक तत्वों में कम।",
    best_crops: ["Rice"],
    suitable_crops: ["Sugarcane"],
    regions: ["Kerala", "Karnataka", "Goa", "Maharashtra", "Odisha", "West Bengal"]
  },
  {
    soil_type: "Sandy",
    soil_type_hi: "रेतीली",
    description: "Poor water retention, well-drained. Good for drought-resistant crops.",
    description_hi: "पानी रोकने की कम क्षमता, अच्छी जल निकासी। सूखा प्रतिरोधी फसलों के लिए अच्छी।",
    best_crops: ["Pearl Millet", "Watermelon", "Muskmelon"],
    suitable_crops: ["Groundnut", "Moong Bean"],
    regions: ["Rajasthan", "Gujarat", "Haryana"]
  },
  {
    soil_type: "Sandy Loam",
    soil_type_hi: "रेतीली दोमट",
    description: "Balanced texture with good drainage. Versatile for many crops.",
    description_hi: "अच्छी जल निकासी के साथ संतुलित बनावट। कई फसलों के लिए उपयुक्त।",
    best_crops: ["Potato", "Groundnut", "Watermelon", "Cucumber"],
    suitable_crops: ["Cotton", "Maize", "Mustard", "Barley", "Onion", "Muskmelon", "Bitter Gourd", "Pearl Millet", "Chickpea", "Moong Bean"],
    regions: ["Punjab", "Haryana", "Uttar Pradesh", "Rajasthan", "Gujarat"]
  },
  {
    soil_type: "Loamy",
    soil_type_hi: "दोमट",
    description: "Ideal mixture of sand, silt, and clay. Best for most crops.",
    description_hi: "रेत, गाद और मिट्टी का आदर्श मिश्रण। अधिकांश फसलों के लिए सर्वोत्तम।",
    best_crops: ["Wheat", "Maize", "Potato", "Onion"],
    suitable_crops: ["Rice", "Cotton", "Sugarcane", "Groundnut", "Mustard", "Barley", "Lentil", "Cucumber", "Moong Bean", "Bitter Gourd", "Muskmelon"],
    regions: ["Punjab", "Haryana", "Uttar Pradesh", "Madhya Pradesh", "Bihar"]
  },
  {
    soil_type: "Clay",
    soil_type_hi: "चिकनी मिट्टी",
    description: "High water retention, poor drainage. Good for paddy cultivation.",
    description_hi: "उच्च जल धारण, खराब जल निकासी। धान की खेती के लिए अच्छी।",
    best_crops: ["Rice", "Soybean"],
    suitable_crops: ["Wheat", "Sugarcane", "Mustard", "Lentil"],
    regions: ["West Bengal", "Bihar", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu"]
  },
  {
    soil_type: "Clayey Loam",
    soil_type_hi: "चिकनी दोमट",
    description: "Mix of clay and loam. Good moisture retention with moderate drainage.",
    description_hi: "चिकनी और दोमट का मिश्रण। मध्यम जल निकासी के साथ अच्छी नमी धारण।",
    best_crops: ["Rice", "Wheat"],
    suitable_crops: ["Sugarcane", "Soybean"],
    regions: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar"]
  },
  {
    soil_type: "Mountain",
    soil_type_hi: "पर्वतीय",
    description: "Found in hilly regions. Rich in humus but acidic.",
    description_hi: "पहाड़ी क्षेत्रों में पाई जाती है। ह्यूमस से समृद्ध लेकिन अम्लीय।",
    best_crops: ["Potato", "Maize"],
    suitable_crops: ["Barley", "Wheat"],
    regions: ["Himachal Pradesh", "Uttarakhand", "Jammu & Kashmir", "Sikkim", "Arunachal Pradesh"]
  }
];

// Get soil compatibility for a specific crop
export function getSoilCompatibility(soilType: string, cropName: string): 'best' | 'suitable' | 'unsuitable' {
  const soil = SOIL_COMPATIBILITY.find(s => s.soil_type === soilType);
  if (!soil) return 'unsuitable';
  
  if (soil.best_crops.includes(cropName)) return 'best';
  if (soil.suitable_crops.includes(cropName)) return 'suitable';
  return 'unsuitable';
}

// Get all compatible crops for a soil type
export function getCropsForSoil(soilType: string): { best: string[]; suitable: string[] } {
  const soil = SOIL_COMPATIBILITY.find(s => s.soil_type === soilType);
  if (!soil) return { best: [], suitable: [] };
  
  return {
    best: soil.best_crops,
    suitable: soil.suitable_crops
  };
}
