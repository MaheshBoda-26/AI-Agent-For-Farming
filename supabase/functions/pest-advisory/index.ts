import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Embedded pest database for rule engine
const pestDatabase = [
  {
    pest_name: "Brown Plant Hopper (BPH)",
    crop: ["rice", "paddy"],
    pest_type: "insect",
    growth_stages: ["tillering", "panicle initiation", "flowering"],
    symptoms: ["yellowing", "hopper burn", "circular patches", "honeydew", "sooty mold", "wilting", "drying"],
    favorable_weather: { humidity: "high", temperature: "moderate" },
    risk_level: "severe",
  },
  {
    pest_name: "Rice Blast",
    crop: ["rice", "paddy"],
    pest_type: "fungal",
    growth_stages: ["seedling", "tillering", "panicle initiation", "flowering"],
    symptoms: ["diamond lesions", "grey center", "brown border", "neck rot", "panicle blast", "white grains"],
    favorable_weather: { humidity: "high", temperature: "moderate", rainfall: "moderate" },
    risk_level: "severe",
  },
  {
    pest_name: "Stem Borer",
    crop: ["rice", "paddy", "maize", "sugarcane"],
    pest_type: "insect",
    growth_stages: ["tillering", "panicle initiation", "flowering"],
    symptoms: ["dead heart", "white ear", "bore holes", "frass", "central shoot wilting"],
    favorable_weather: { humidity: "high", temperature: "hot" },
    risk_level: "high",
  },
  {
    pest_name: "Yellow Rust",
    crop: ["wheat"],
    pest_type: "fungal",
    growth_stages: ["tillering", "stem elongation", "heading", "flowering"],
    symptoms: ["yellow stripes", "pustules", "rows between veins", "yellow powder", "premature drying"],
    favorable_weather: { humidity: "high", temperature: "cool", rainfall: "light" },
    risk_level: "severe",
  },
  {
    pest_name: "Aphids",
    crop: ["wheat", "mustard", "vegetables", "cotton"],
    pest_type: "insect",
    growth_stages: ["tillering", "stem elongation", "heading", "flowering", "grain filling", "vegetative"],
    symptoms: ["colonies", "honeydew", "sooty mold", "curling", "stunted growth", "yellowing"],
    favorable_weather: { humidity: "moderate", temperature: "cool" },
    risk_level: "moderate",
  },
  {
    pest_name: "American Bollworm",
    crop: ["cotton", "tomato", "chickpea", "pigeon pea"],
    pest_type: "insect",
    growth_stages: ["flowering", "boll formation", "fruiting"],
    symptoms: ["bore holes", "damaged squares", "frass", "shedding", "rotting bolls"],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "severe",
  },
  {
    pest_name: "Whitefly",
    crop: ["cotton", "vegetables", "tomato", "brinjal"],
    pest_type: "insect",
    growth_stages: ["vegetative", "flowering", "fruiting"],
    symptoms: ["white flies", "honeydew", "sooty mold", "leaf curl", "yellowing", "wilting"],
    favorable_weather: { humidity: "low", temperature: "hot" },
    risk_level: "high",
  },
  {
    pest_name: "Fruit Borer",
    crop: ["tomato", "brinjal", "okra", "chilli"],
    pest_type: "insect",
    growth_stages: ["flowering", "fruiting"],
    symptoms: ["holes in fruits", "rotting", "frass inside", "premature drop", "larvae"],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "high",
  },
  {
    pest_name: "Powdery Mildew",
    crop: ["cucurbits", "pea", "okra", "mango", "grapes"],
    pest_type: "fungal",
    growth_stages: ["vegetative", "flowering", "fruiting"],
    symptoms: ["white powder", "leaf curling", "yellowing", "premature leaf fall", "stunted"],
    favorable_weather: { humidity: "moderate", temperature: "moderate" },
    risk_level: "moderate",
  },
  {
    pest_name: "Bacterial Wilt",
    crop: ["tomato", "brinjal", "chilli", "potato", "ginger"],
    pest_type: "bacterial",
    growth_stages: ["vegetative", "flowering", "fruiting"],
    symptoms: ["sudden wilting", "green leaves wilting", "brown vascular", "bacterial ooze", "plant death"],
    favorable_weather: { humidity: "high", temperature: "hot", rainfall: "heavy" },
    risk_level: "severe",
  },
  {
    pest_name: "Pod Borer",
    crop: ["chickpea", "pigeon pea", "green gram", "black gram"],
    pest_type: "insect",
    growth_stages: ["flowering", "pod formation"],
    symptoms: ["holes in pods", "larvae feeding", "frass on pods", "damaged seeds", "pod drop"],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "high",
  },
  {
    pest_name: "Wilt (Fusarium)",
    crop: ["chickpea", "pigeon pea", "lentil", "banana", "tomato"],
    pest_type: "fungal",
    growth_stages: ["seedling", "vegetative", "flowering"],
    symptoms: ["yellowing lower leaves", "wilting", "browning vascular", "drooping", "plant death"],
    favorable_weather: { humidity: "moderate", temperature: "moderate" },
    risk_level: "severe",
  },
  {
    pest_name: "Mustard Aphid",
    crop: ["mustard", "rapeseed", "canola"],
    pest_type: "insect",
    growth_stages: ["vegetative", "flowering", "pod formation"],
    symptoms: ["green-grey colonies", "curling", "honeydew", "stunted", "poor pod formation"],
    favorable_weather: { humidity: "moderate", temperature: "cool" },
    risk_level: "high",
  },
  {
    pest_name: "Fruit Fly",
    crop: ["mango", "guava", "citrus", "cucurbits", "tomato"],
    pest_type: "insect",
    growth_stages: ["fruiting"],
    symptoms: ["oviposition marks", "maggots", "premature drop", "fruit rotting", "oozing"],
    favorable_weather: { humidity: "high", temperature: "hot", rainfall: "moderate" },
    risk_level: "high",
  },
  {
    pest_name: "Mango Hopper",
    crop: ["mango"],
    pest_type: "insect",
    growth_stages: ["flowering", "fruiting"],
    symptoms: ["hoppers on inflorescence", "drying flowers", "honeydew", "sooty mold", "poor fruit set"],
    favorable_weather: { humidity: "moderate", temperature: "hot" },
    risk_level: "high",
  },
];

interface PestInput {
  crop_name: string;
  growth_stage: string;
  symptoms_text: string;
  image_base64?: string;
  language?: string;
}

interface CandidatePest {
  pest_name: string;
  crop: string[];
  pest_type: string;
  risk_level: string;
  score: number;
  matched_symptoms: string[];
}

// Rule engine: filter and score pests
function runRuleEngine(input: PestInput): CandidatePest[] {
  const cropName = input.crop_name.toLowerCase();
  const stage = input.growth_stage.toLowerCase();
  const symptomsText = input.symptoms_text.toLowerCase();
  
  const candidates: CandidatePest[] = [];
  
  for (const pest of pestDatabase) {
    // Filter by crop
    const cropMatch = pest.crop.some(c => 
      cropName.includes(c.toLowerCase()) || c.toLowerCase().includes(cropName)
    );
    if (!cropMatch) continue;
    
    // Filter by growth stage (partial match)
    const stageMatch = pest.growth_stages.some(s => 
      stage.includes(s.toLowerCase()) || s.toLowerCase().includes(stage)
    );
    
    // Score by symptom matching
    const matchedSymptoms: string[] = [];
    let symptomScore = 0;
    
    for (const symptom of pest.symptoms) {
      const symptomLower = symptom.toLowerCase();
      // Check if any word from symptom appears in user text
      const symptomWords = symptomLower.split(/\s+/);
      for (const word of symptomWords) {
        if (word.length > 3 && symptomsText.includes(word)) {
          matchedSymptoms.push(symptom);
          symptomScore += 1;
          break;
        }
      }
    }
    
    if (matchedSymptoms.length === 0) continue;
    
    // Calculate final score
    let score = (symptomScore / pest.symptoms.length) * 0.7;
    if (stageMatch) score += 0.2;
    if (cropMatch) score += 0.1;
    
    candidates.push({
      pest_name: pest.pest_name,
      crop: pest.crop,
      pest_type: pest.pest_type,
      risk_level: pest.risk_level,
      score: Math.min(score, 1.0),
      matched_symptoms: matchedSymptoms,
    });
  }
  
  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);
  
  return candidates.slice(0, 3);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PestInput = await req.json();
    
    // Validate input
    if (!input.crop_name || !input.growth_stage || !input.symptoms_text) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: crop_name, growth_stage, symptoms_text" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Run rule engine first
    const candidates = runRuleEngine(input);
    
    if (candidates.length === 0) {
      return new Response(
        JSON.stringify({
          pest_name: null,
          confidence: 0,
          message: "No matching pest found based on the symptoms provided. Please consult your local Krishi Vigyan Kendra or agriculture officer.",
          reasons: [],
          actions: ["Contact local agriculture extension officer", "Visit nearest KVK for expert diagnosis"],
          prevention: ["Maintain field hygiene", "Regular crop monitoring"],
          risk_note: "Unable to identify pest from provided symptoms. Manual inspection recommended."
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const topPest = candidates[0];
    const lang = input.language || "en";
    
    // Build prompt for AI advisory generation
    const systemPrompt = `You are an expert agricultural pathologist specializing in Indian crops. Generate a detailed pest advisory based on the identified pest.

RULES:
1. Respond ONLY in valid JSON format
2. Do NOT include specific chemical dosage quantities - only mention pesticide NAMES
3. Provide India-specific advice with locally available products
4. Use simple farmer-friendly language
5. ${lang === "hi" ? "Respond in Hindi" : lang === "te" ? "Respond in Telugu" : "Respond in English"}
6. Always prioritize organic/mechanical controls first
7. Chemical pesticides should be listed separately with a warning to consult local agriculture officer for dosage

OUTPUT FORMAT (strict JSON):
{
  "pest_name": "string",
  "pest_name_local": "string in ${lang === "hi" ? "Hindi" : lang === "te" ? "Telugu" : "English"}",
  "confidence": number (0-1),
  "pest_type": "string",
  "reasons": ["why this pest matches the symptoms"],
  "actions": ["immediate organic/mechanical actions - neem spray, traps, manual removal, etc."],
  "chemical_options": ["list pesticide NAMES only like Imidacloprid, Chlorpyrifos, etc. - NO dosages"],
  "prevention": ["future prevention steps including resistant varieties, crop rotation, etc."],
  "risk_note": "what happens if ignored",
  "follow_up": "when to seek expert help"
}`;

    const userPrompt = `Identified pest: ${topPest.pest_name}
Crop: ${input.crop_name}
Growth stage: ${input.growth_stage}
Farmer's symptoms: ${input.symptoms_text}
Matched symptoms from database: ${topPest.matched_symptoms.join(", ")}
Confidence score from rule engine: ${(topPest.score * 100).toFixed(0)}%
Risk level: ${topPest.risk_level}

Generate a comprehensive advisory for this pest.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    if (!aiContent) {
      // Fallback response using rule engine data only
      return new Response(
        JSON.stringify({
          pest_name: topPest.pest_name,
          confidence: topPest.score,
          pest_type: topPest.pest_type,
          reasons: [`Matched symptoms: ${topPest.matched_symptoms.join(", ")}`],
          actions: ["Consult local agriculture officer for treatment options"],
          prevention: ["Maintain field hygiene", "Regular monitoring"],
          risk_note: `Risk level: ${topPest.risk_level}. Seek expert help if condition worsens.`,
          other_candidates: candidates.slice(1).map(c => ({
            pest_name: c.pest_name,
            confidence: c.score,
            matched_symptoms: c.matched_symptoms
          }))
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse AI response
    let advisory;
    try {
      // Extract JSON from response (handle markdown code blocks)
      let jsonStr = aiContent;
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      advisory = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, return rule engine result with AI text
      return new Response(
        JSON.stringify({
          pest_name: topPest.pest_name,
          confidence: topPest.score,
          pest_type: topPest.pest_type,
          reasons: [`Matched symptoms: ${topPest.matched_symptoms.join(", ")}`],
          actions: ["Consult local agriculture officer"],
          prevention: ["Regular monitoring"],
          risk_note: aiContent.substring(0, 500),
          other_candidates: candidates.slice(1).map(c => ({
            pest_name: c.pest_name,
            confidence: c.score
          }))
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Add other candidates to response
    advisory.other_candidates = candidates.slice(1).map(c => ({
      pest_name: c.pest_name,
      confidence: c.score,
      matched_symptoms: c.matched_symptoms
    }));

    return new Response(
      JSON.stringify(advisory),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("pest-advisory error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
