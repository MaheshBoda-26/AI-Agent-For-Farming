// Symptom keywords to pest/disease mapping for NLP matching
export interface SymptomMapping {
  keywords: string[];
  keywords_hi: string[];
  pest_names: string[];
  weight: number;
}

export const symptomMappings: SymptomMapping[] = [
  // Yellowing symptoms
  {
    keywords: ["yellow", "yellowing", "chlorosis", "pale", "yellow leaves"],
    keywords_hi: ["पीला", "पीलापन", "पीली पत्तियां"],
    pest_names: ["Brown Plant Hopper (BPH)", "Aphids", "Wilt (Fusarium)", "Yellow Rust (Stripe Rust)"],
    weight: 0.8
  },
  
  // Wilting symptoms
  {
    keywords: ["wilt", "wilting", "drooping", "drying", "dried"],
    keywords_hi: ["मुरझाना", "सूखना", "सूखा"],
    pest_names: ["Bacterial Wilt", "Wilt (Fusarium)", "Brown Plant Hopper (BPH)", "Stem Borer"],
    weight: 0.9
  },
  
  // Holes/bore symptoms
  {
    keywords: ["hole", "holes", "bore", "bored", "tunnel", "bore hole"],
    keywords_hi: ["छेद", "सुरंग"],
    pest_names: ["Stem Borer", "Fruit Borer", "Pod Borer", "American Bollworm"],
    weight: 0.95
  },
  
  // White powder/mold symptoms
  {
    keywords: ["white powder", "powder", "powdery", "white coating", "mold", "fungus"],
    keywords_hi: ["सफेद पाउडर", "फफूंद", "चूर्ण"],
    pest_names: ["Powdery Mildew", "White Rust"],
    weight: 0.9
  },
  
  // Spots/lesions symptoms
  {
    keywords: ["spot", "spots", "lesion", "lesions", "patches", "diamond shaped"],
    keywords_hi: ["धब्बे", "दाग"],
    pest_names: ["Rice Blast", "Bacterial Wilt"],
    weight: 0.85
  },
  
  // Honeydew/sooty mold symptoms
  {
    keywords: ["honeydew", "sticky", "black mold", "sooty", "shiny leaves"],
    keywords_hi: ["चिपचिपा", "काला फफूंद"],
    pest_names: ["Aphids", "Whitefly", "Brown Plant Hopper (BPH)", "Mango Hopper"],
    weight: 0.8
  },
  
  // Curling symptoms
  {
    keywords: ["curl", "curling", "curled leaves", "twisted", "distorted"],
    keywords_hi: ["मुड़ना", "मुड़ी पत्तियां"],
    pest_names: ["Aphids", "Whitefly", "Powdery Mildew", "White Rust"],
    weight: 0.85
  },
  
  // Pest visible symptoms
  {
    keywords: ["insects", "bugs", "flies", "worms", "caterpillar", "larvae", "maggot"],
    keywords_hi: ["कीड़े", "सुंडी", "इल्ली", "मक्खी"],
    pest_names: ["Aphids", "Whitefly", "Fruit Fly", "American Bollworm", "Stem Borer"],
    weight: 0.9
  },
  
  // Dead heart/white ear symptoms
  {
    keywords: ["dead heart", "white ear", "empty grain", "chaffy"],
    keywords_hi: ["मृत गभ", "सफेद बाली"],
    pest_names: ["Stem Borer"],
    weight: 1.0
  },
  
  // Fruit damage symptoms
  {
    keywords: ["fruit damage", "fruit rot", "damaged fruit", "fruit drop", "premature drop"],
    keywords_hi: ["फल खराब", "फल सड़ना", "फल गिरना"],
    pest_names: ["Fruit Borer", "Fruit Fly", "American Bollworm"],
    weight: 0.9
  },
  
  // Pod damage symptoms  
  {
    keywords: ["pod damage", "pod hole", "damaged seeds", "empty pod"],
    keywords_hi: ["फली में छेद", "खराब बीज"],
    pest_names: ["Pod Borer", "American Bollworm"],
    weight: 0.95
  },
  
  // Stripe/rust symptoms
  {
    keywords: ["stripe", "rust", "orange powder", "pustules", "yellow stripes"],
    keywords_hi: ["धारियां", "रतुआ", "नारंगी पाउडर"],
    pest_names: ["Yellow Rust (Stripe Rust)"],
    weight: 0.95
  },
  
  // Neck rot symptoms
  {
    keywords: ["neck rot", "panicle damage", "broken neck"],
    keywords_hi: ["गर्दन सड़ना"],
    pest_names: ["Rice Blast"],
    weight: 0.9
  },
  
  // Colony symptoms
  {
    keywords: ["colony", "colonies", "cluster", "group of insects"],
    keywords_hi: ["झुंड", "समूह"],
    pest_names: ["Aphids", "Brown Plant Hopper (BPH)", "Mustard Aphid", "Mango Hopper"],
    weight: 0.8
  },
  
  // Stunted growth symptoms
  {
    keywords: ["stunted", "slow growth", "small plants", "poor growth"],
    keywords_hi: ["बौना", "धीमी वृद्धि"],
    pest_names: ["Aphids", "Whitefly", "Powdery Mildew", "Wilt (Fusarium)"],
    weight: 0.7
  },
  
  // Boll damage symptoms
  {
    keywords: ["boll damage", "boll rot", "square damage", "shedding"],
    keywords_hi: ["टिंडा खराब", "टिंडा सड़ना"],
    pest_names: ["American Bollworm", "Whitefly"],
    weight: 0.95
  },
  
  // Vascular discoloration
  {
    keywords: ["brown stem", "vascular", "brown inside stem", "xylem brown"],
    keywords_hi: ["तना भूरा", "अंदर भूरा"],
    pest_names: ["Bacterial Wilt", "Wilt (Fusarium)"],
    weight: 0.9
  },
  
  // Flower damage
  {
    keywords: ["flower damage", "flower drying", "no flowers", "flower drop"],
    keywords_hi: ["फूल खराब", "फूल सूखना", "फूल गिरना"],
    pest_names: ["Mango Hopper", "Fruit Fly", "Thrips"],
    weight: 0.85
  }
];

// Extract all unique symptom keywords for autocomplete/suggestions
export const getAllSymptomKeywords = (): string[] => {
  const keywords = new Set<string>();
  symptomMappings.forEach(mapping => {
    mapping.keywords.forEach(k => keywords.add(k.toLowerCase()));
  });
  return Array.from(keywords).sort();
};
