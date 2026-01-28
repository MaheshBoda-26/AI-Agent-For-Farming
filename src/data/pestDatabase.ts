// India-specific pest and disease database
export interface Pest {
  pest_name: string;
  pest_name_hi: string;
  crop: string[];
  pest_type: 'insect' | 'fungal' | 'bacterial' | 'viral' | 'nematode' | 'mite';
  growth_stages: string[];
  symptoms: string[];
  favorable_weather: {
    humidity?: 'high' | 'moderate' | 'low';
    temperature?: 'hot' | 'moderate' | 'cool';
    rainfall?: 'heavy' | 'moderate' | 'light' | 'none';
  };
  risk_level: 'low' | 'moderate' | 'high' | 'severe';
  organic_controls: string[];
  mechanical_controls: string[];
  chemical_category: string;
  prevention: string[];
}

export const pestDatabase: Pest[] = [
  // Rice Pests
  {
    pest_name: "Brown Plant Hopper (BPH)",
    pest_name_hi: "भूरा फुदका",
    crop: ["rice", "paddy"],
    pest_type: "insect",
    growth_stages: ["tillering", "panicle initiation", "flowering"],
    symptoms: [
      "yellowing of leaves",
      "hopper burn",
      "circular patches of dried plants",
      "honeydew on leaves",
      "sooty mold",
      "wilting",
      "drying of tillers"
    ],
    favorable_weather: { humidity: "high", temperature: "moderate" },
    risk_level: "severe",
    organic_controls: [
      "Neem oil spray",
      "Release natural predators like spiders and mirid bugs",
      "Use light traps at night",
      "Apply ash on plant base"
    ],
    mechanical_controls: [
      "Drain water from field for 3-4 days",
      "Remove weeds and alternate hosts",
      "Use yellow sticky traps"
    ],
    chemical_category: "Systemic insecticides (consult local agriculture officer for approved products)",
    prevention: [
      "Avoid excessive nitrogen fertilizer",
      "Maintain proper spacing",
      "Use resistant varieties like IR36, IR64",
      "Avoid continuous flooding"
    ]
  },
  {
    pest_name: "Rice Blast",
    pest_name_hi: "धान का झुलसा रोग",
    crop: ["rice", "paddy"],
    pest_type: "fungal",
    growth_stages: ["seedling", "tillering", "panicle initiation", "flowering"],
    symptoms: [
      "diamond-shaped lesions on leaves",
      "grey center with brown border",
      "neck rot",
      "panicle blast",
      "white empty grains",
      "node blast"
    ],
    favorable_weather: { humidity: "high", temperature: "moderate", rainfall: "moderate" },
    risk_level: "severe",
    organic_controls: [
      "Trichoderma seed treatment",
      "Pseudomonas fluorescens spray",
      "Silicon-rich fertilizers"
    ],
    mechanical_controls: [
      "Remove and burn infected plant debris",
      "Proper field sanitation"
    ],
    chemical_category: "Fungicides (tricyclazole category - consult KVK)",
    prevention: [
      "Use certified disease-free seeds",
      "Balanced fertilization",
      "Avoid excess nitrogen",
      "Use resistant varieties"
    ]
  },
  {
    pest_name: "Stem Borer",
    pest_name_hi: "तना छेदक",
    crop: ["rice", "paddy", "maize", "sugarcane"],
    pest_type: "insect",
    growth_stages: ["tillering", "panicle initiation", "flowering"],
    symptoms: [
      "dead heart in vegetative stage",
      "white ear in reproductive stage",
      "bore holes on stem",
      "frass near holes",
      "central shoot wilting"
    ],
    favorable_weather: { humidity: "high", temperature: "hot" },
    risk_level: "high",
    organic_controls: [
      "Release Trichogramma parasitoids",
      "Neem cake application",
      "Pheromone traps"
    ],
    mechanical_controls: [
      "Collect and destroy egg masses",
      "Remove and burn stubbles after harvest",
      "Light traps"
    ],
    chemical_category: "Granular insecticides (consult agriculture officer)",
    prevention: [
      "Early and synchronous planting",
      "Avoid late planting",
      "Clipping leaf tips during transplanting",
      "Balanced NPK fertilization"
    ]
  },

  // Wheat Pests
  {
    pest_name: "Yellow Rust (Stripe Rust)",
    pest_name_hi: "पीली रतुआ",
    crop: ["wheat"],
    pest_type: "fungal",
    growth_stages: ["tillering", "stem elongation", "heading", "flowering"],
    symptoms: [
      "yellow stripes on leaves",
      "pustules in rows between veins",
      "yellow powder on leaves",
      "premature drying"
    ],
    favorable_weather: { humidity: "high", temperature: "cool", rainfall: "light" },
    risk_level: "severe",
    organic_controls: [
      "No effective organic control available",
      "Focus on resistant varieties"
    ],
    mechanical_controls: [
      "Remove volunteer wheat plants",
      "Destroy infected crop debris"
    ],
    chemical_category: "Triazole fungicides (consult KVK for approved products)",
    prevention: [
      "Grow resistant varieties",
      "Timely sowing",
      "Avoid late sowing",
      "Balanced fertilization"
    ]
  },
  {
    pest_name: "Aphids",
    pest_name_hi: "माहू/चेपा",
    crop: ["wheat", "mustard", "vegetables", "cotton"],
    pest_type: "insect",
    growth_stages: ["tillering", "stem elongation", "heading", "flowering", "grain filling"],
    symptoms: [
      "colonies under leaves",
      "honeydew secretion",
      "sooty mold growth",
      "curling of leaves",
      "stunted growth",
      "yellowing"
    ],
    favorable_weather: { humidity: "moderate", temperature: "cool" },
    risk_level: "moderate",
    organic_controls: [
      "Neem oil spray 2-3ml per liter",
      "Soap water spray",
      "Release ladybird beetles",
      "Spray garlic-chili extract"
    ],
    mechanical_controls: [
      "Strong water spray to dislodge",
      "Yellow sticky traps",
      "Remove heavily infested parts"
    ],
    chemical_category: "Contact or systemic insecticides (only if severe infestation)",
    prevention: [
      "Timely sowing",
      "Avoid excessive nitrogen",
      "Maintain field hygiene",
      "Conserve natural enemies"
    ]
  },

  // Cotton Pests
  {
    pest_name: "American Bollworm",
    pest_name_hi: "अमेरिकन सुंडी",
    crop: ["cotton", "tomato", "chickpea", "pigeon pea"],
    pest_type: "insect",
    growth_stages: ["flowering", "boll formation", "fruiting"],
    symptoms: [
      "bore holes in bolls",
      "damaged squares and flowers",
      "frass around bore holes",
      "shedding of squares",
      "rotting of bolls"
    ],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "severe",
    organic_controls: [
      "Bt spray (Bacillus thuringiensis)",
      "NPV (Nuclear Polyhedrosis Virus)",
      "Neem seed kernel extract",
      "Release Trichogramma weekly"
    ],
    mechanical_controls: [
      "Pheromone traps for monitoring",
      "Hand picking of larvae",
      "Bird perches in field",
      "Deep summer ploughing"
    ],
    chemical_category: "IPM-based approach recommended (consult cotton specialist)",
    prevention: [
      "Use Bt cotton varieties",
      "Timely sowing",
      "Refuge crop management",
      "Avoid monocropping"
    ]
  },
  {
    pest_name: "Whitefly",
    pest_name_hi: "सफेद मक्खी",
    crop: ["cotton", "vegetables", "tomato", "brinjal"],
    pest_type: "insect",
    growth_stages: ["vegetative", "flowering", "fruiting"],
    symptoms: [
      "white tiny flies on leaf undersurface",
      "honeydew on leaves",
      "sooty mold",
      "leaf curl virus transmission",
      "yellowing and wilting"
    ],
    favorable_weather: { humidity: "low", temperature: "hot" },
    risk_level: "high",
    organic_controls: [
      "Neem oil spray",
      "Yellow sticky traps",
      "Spray tobacco decoction",
      "Release Encarsia formosa"
    ],
    mechanical_controls: [
      "Install yellow sticky traps",
      "Remove infected plants",
      "Weed management"
    ],
    chemical_category: "Systemic insecticides (only as last resort)",
    prevention: [
      "Use tolerant varieties",
      "Avoid excess nitrogen",
      "Maintain spacing",
      "Intercropping with maize"
    ]
  },

  // Vegetable Pests
  {
    pest_name: "Fruit Borer",
    pest_name_hi: "फल छेदक",
    crop: ["tomato", "brinjal", "okra", "chilli"],
    pest_type: "insect",
    growth_stages: ["flowering", "fruiting"],
    symptoms: [
      "holes in fruits",
      "rotting of fruits",
      "frass inside fruit",
      "premature fruit drop",
      "larvae inside fruit"
    ],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "high",
    organic_controls: [
      "Bt spray weekly",
      "Neem oil spray",
      "Pheromone traps",
      "Trichogramma release"
    ],
    mechanical_controls: [
      "Collect and destroy infested fruits",
      "Install pheromone traps",
      "Bird perches"
    ],
    chemical_category: "Selective insecticides with short PHI",
    prevention: [
      "Clean cultivation",
      "Crop rotation",
      "Remove alternate hosts",
      "Summer ploughing"
    ]
  },
  {
    pest_name: "Powdery Mildew",
    pest_name_hi: "चूर्णिल आसिता",
    crop: ["cucurbits", "pea", "okra", "mango", "grapes"],
    pest_type: "fungal",
    growth_stages: ["vegetative", "flowering", "fruiting"],
    symptoms: [
      "white powdery coating on leaves",
      "leaf curling",
      "yellowing of leaves",
      "premature leaf fall",
      "stunted growth"
    ],
    favorable_weather: { humidity: "moderate", temperature: "moderate" },
    risk_level: "moderate",
    organic_controls: [
      "Sulfur dust (wettable sulfur)",
      "Baking soda spray",
      "Neem oil spray",
      "Milk spray (1:10 dilution)"
    ],
    mechanical_controls: [
      "Remove and destroy infected leaves",
      "Improve air circulation",
      "Avoid overhead irrigation"
    ],
    chemical_category: "Sulfur-based fungicides or systemic fungicides",
    prevention: [
      "Use resistant varieties",
      "Proper spacing",
      "Avoid excess nitrogen",
      "Morning irrigation"
    ]
  },
  {
    pest_name: "Bacterial Wilt",
    pest_name_hi: "जीवाणु म्लानि",
    crop: ["tomato", "brinjal", "chilli", "potato", "ginger"],
    pest_type: "bacterial",
    growth_stages: ["vegetative", "flowering", "fruiting"],
    symptoms: [
      "sudden wilting",
      "green leaves wilting",
      "brown vascular discoloration",
      "bacterial ooze from cut stem",
      "plant death"
    ],
    favorable_weather: { humidity: "high", temperature: "hot", rainfall: "heavy" },
    risk_level: "severe",
    organic_controls: [
      "Pseudomonas fluorescens application",
      "Trichoderma seed treatment",
      "Neem cake soil application"
    ],
    mechanical_controls: [
      "Remove and destroy infected plants",
      "Improve drainage",
      "Avoid injury to roots"
    ],
    chemical_category: "No effective chemical control - focus on prevention",
    prevention: [
      "Use resistant varieties",
      "Crop rotation with non-solanaceous crops",
      "Raised bed cultivation",
      "Avoid waterlogging",
      "Use disease-free seedlings"
    ]
  },

  // Pulse Pests
  {
    pest_name: "Pod Borer",
    pest_name_hi: "फली छेदक",
    crop: ["chickpea", "pigeon pea", "green gram", "black gram"],
    pest_type: "insect",
    growth_stages: ["flowering", "pod formation"],
    symptoms: [
      "holes in pods",
      "larvae feeding on seeds",
      "frass on pods",
      "damaged seeds",
      "pod drop"
    ],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "high",
    organic_controls: [
      "Bt spray",
      "NPV spray",
      "Neem seed kernel extract",
      "Trichogramma release"
    ],
    mechanical_controls: [
      "Pheromone traps",
      "Hand picking of larvae",
      "Bird perches",
      "Deep ploughing"
    ],
    chemical_category: "Selective insecticides (consult agriculture officer)",
    prevention: [
      "Early sowing",
      "Use resistant varieties",
      "Intercropping",
      "Clean cultivation"
    ]
  },
  {
    pest_name: "Wilt (Fusarium)",
    pest_name_hi: "उकठा रोग",
    crop: ["chickpea", "pigeon pea", "lentil", "banana", "tomato"],
    pest_type: "fungal",
    growth_stages: ["seedling", "vegetative", "flowering"],
    symptoms: [
      "yellowing of lower leaves",
      "wilting of plants",
      "browning of vascular tissue",
      "drooping of leaves",
      "plant death"
    ],
    favorable_weather: { humidity: "moderate", temperature: "moderate" },
    risk_level: "severe",
    organic_controls: [
      "Trichoderma viride seed treatment",
      "Pseudomonas fluorescens",
      "Neem cake application"
    ],
    mechanical_controls: [
      "Remove and destroy infected plants",
      "Deep summer ploughing",
      "Improve drainage"
    ],
    chemical_category: "Fungicide seed treatment (consult KVK)",
    prevention: [
      "Use resistant varieties",
      "Crop rotation (4 year gap)",
      "Soil solarization",
      "Balanced fertilization"
    ]
  },

  // Oilseed Pests
  {
    pest_name: "Mustard Aphid",
    pest_name_hi: "सरसों की माहू",
    crop: ["mustard", "rapeseed", "canola"],
    pest_type: "insect",
    growth_stages: ["vegetative", "flowering", "pod formation"],
    symptoms: [
      "green-grey colonies on shoots",
      "curling of leaves",
      "honeydew secretion",
      "stunted growth",
      "poor pod formation"
    ],
    favorable_weather: { humidity: "moderate", temperature: "cool" },
    risk_level: "high",
    organic_controls: [
      "Neem oil spray",
      "Soap water spray",
      "Release ladybird beetles",
      "Spray tobacco decoction"
    ],
    mechanical_controls: [
      "Yellow sticky traps",
      "Remove heavily infested parts",
      "Water spray to dislodge"
    ],
    chemical_category: "Contact or systemic insecticides (only if 25+ aphids per plant)",
    prevention: [
      "Early sowing (October)",
      "Use tolerant varieties",
      "Avoid late sowing",
      "Conserve natural enemies"
    ]
  },
  {
    pest_name: "White Rust",
    pest_name_hi: "श्वेत किट्ट",
    crop: ["mustard", "rapeseed"],
    pest_type: "fungal",
    growth_stages: ["vegetative", "flowering"],
    symptoms: [
      "white pustules on leaves",
      "distorted inflorescence",
      "staghead formation",
      "blistering on leaves",
      "no seed formation in affected parts"
    ],
    favorable_weather: { humidity: "high", temperature: "cool", rainfall: "moderate" },
    risk_level: "moderate",
    organic_controls: [
      "Trichoderma seed treatment",
      "Remove infected parts early"
    ],
    mechanical_controls: [
      "Remove and destroy infected plants",
      "Field sanitation"
    ],
    chemical_category: "Metalaxyl-based fungicides (consult KVK)",
    prevention: [
      "Use resistant varieties",
      "Timely sowing",
      "Balanced fertilization",
      "Avoid dense planting"
    ]
  },

  // Fruit Pests
  {
    pest_name: "Fruit Fly",
    pest_name_hi: "फल मक्खी",
    crop: ["mango", "guava", "citrus", "cucurbits", "tomato"],
    pest_type: "insect",
    growth_stages: ["fruiting"],
    symptoms: [
      "oviposition marks on fruit",
      "maggots inside fruit",
      "premature fruit drop",
      "fruit rotting",
      "oozing from fruit"
    ],
    favorable_weather: { humidity: "high", temperature: "hot", rainfall: "moderate" },
    risk_level: "high",
    organic_controls: [
      "Protein bait traps",
      "Neem oil spray",
      "Pheromone traps (methyl eugenol)",
      "Release parasitoids"
    ],
    mechanical_controls: [
      "Collect and destroy fallen fruits",
      "Bagging of fruits",
      "Field sanitation"
    ],
    chemical_category: "Bait spray with insecticide (consult horticulture officer)",
    prevention: [
      "Early harvesting",
      "Field sanitation",
      "Deep ploughing",
      "Remove alternate hosts"
    ]
  },
  {
    pest_name: "Mango Hopper",
    pest_name_hi: "आम का फुदका",
    crop: ["mango"],
    pest_type: "insect",
    growth_stages: ["flowering", "fruiting"],
    symptoms: [
      "hoppers on inflorescence",
      "drying of flowers",
      "honeydew secretion",
      "sooty mold on leaves",
      "poor fruit set"
    ],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "high",
    organic_controls: [
      "Neem oil spray",
      "Sticky traps",
      "Release natural predators"
    ],
    mechanical_controls: [
      "Shake branches to dislodge",
      "Remove weeds under tree",
      "Light traps"
    ],
    chemical_category: "Contact insecticides at flowering (consult horticulture officer)",
    prevention: [
      "Proper orchard sanitation",
      "Pruning to improve aeration",
      "Avoid dense planting"
    ]
  }
];

export const getCropsList = (): string[] => {
  const crops = new Set<string>();
  pestDatabase.forEach(pest => pest.crop.forEach(c => crops.add(c)));
  return Array.from(crops).sort();
};

export const getGrowthStages = (): string[] => {
  return [
    "seedling",
    "vegetative",
    "tillering",
    "stem elongation",
    "panicle initiation",
    "heading",
    "flowering",
    "fruiting",
    "pod formation",
    "boll formation",
    "grain filling",
    "maturity"
  ];
};
