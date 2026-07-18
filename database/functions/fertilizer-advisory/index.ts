import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fertilizer database for common crops
const fertilizerDatabase = [
  {
    crop: ["rice", "paddy"],
    growth_stages: {
      seedling: { N: "low", P: "medium", K: "low", recommendation: "DAP at transplanting" },
      tillering: { N: "high", P: "low", K: "medium", recommendation: "Urea split application" },
      panicle_initiation: { N: "medium", P: "low", K: "high", recommendation: "MOP application" },
      flowering: { N: "low", P: "low", K: "medium", recommendation: "Foliar spray if deficiency" },
      grain_filling: { N: "none", P: "none", K: "low", recommendation: "No fertilizer needed" },
    },
    organic_options: ["FYM", "Vermicompost", "Green manure", "Azolla"],
  },
  {
    crop: ["wheat"],
    growth_stages: {
      seedling: { N: "medium", P: "high", K: "medium", recommendation: "NPK at sowing" },
      tillering: { N: "high", P: "low", K: "low", recommendation: "First split of Urea" },
      stem_elongation: { N: "medium", P: "low", K: "low", recommendation: "Second split of Urea" },
      heading: { N: "low", P: "low", K: "medium", recommendation: "Foliar spray if needed" },
      grain_filling: { N: "none", P: "none", K: "low", recommendation: "No fertilizer" },
    },
    organic_options: ["FYM", "Vermicompost", "Neem cake"],
  },
  {
    crop: ["cotton"],
    growth_stages: {
      seedling: { N: "low", P: "high", K: "low", recommendation: "DAP at sowing" },
      vegetative: { N: "high", P: "medium", K: "medium", recommendation: "Urea + MOP" },
      flowering: { N: "medium", P: "low", K: "high", recommendation: "Potash application" },
      boll_formation: { N: "low", P: "low", K: "high", recommendation: "Potash spray" },
    },
    organic_options: ["FYM", "Castor cake", "Cotton seed cake"],
  },
  {
    crop: ["tomato", "brinjal", "chilli"],
    growth_stages: {
      seedling: { N: "low", P: "high", K: "low", recommendation: "DAP at transplanting" },
      vegetative: { N: "high", P: "medium", K: "medium", recommendation: "NPK 19:19:19" },
      flowering: { N: "medium", P: "medium", K: "high", recommendation: "Potash + Calcium" },
      fruiting: { N: "low", P: "low", K: "high", recommendation: "Sulphate of Potash" },
    },
    organic_options: ["FYM", "Vermicompost", "Bone meal", "Panchagavya"],
  },
  {
    crop: ["maize"],
    growth_stages: {
      seedling: { N: "medium", P: "high", K: "medium", recommendation: "DAP at sowing" },
      vegetative: { N: "high", P: "low", K: "medium", recommendation: "Urea split doses" },
      tasseling: { N: "medium", P: "low", K: "high", recommendation: "Potash application" },
      grain_filling: { N: "low", P: "none", K: "medium", recommendation: "Foliar zinc spray" },
    },
    organic_options: ["FYM", "Poultry manure", "Green manure"],
  },
  {
    crop: ["sugarcane"],
    growth_stages: {
      seedling: { N: "low", P: "high", K: "medium", recommendation: "Full P & K at planting" },
      tillering: { N: "high", P: "low", K: "low", recommendation: "First Urea dose" },
      grand_growth: { N: "high", P: "low", K: "medium", recommendation: "Second Urea dose" },
      maturity: { N: "none", P: "none", K: "low", recommendation: "Stop nitrogen" },
    },
    organic_options: ["FYM", "Press mud", "Vermicompost", "Biofertilizers"],
  },
  {
    crop: ["chickpea", "pigeon pea", "green gram", "black gram", "lentil"],
    growth_stages: {
      seedling: { N: "low", P: "high", K: "low", recommendation: "DAP + Rhizobium" },
      vegetative: { N: "none", P: "low", K: "medium", recommendation: "Nitrogen from root nodules" },
      flowering: { N: "none", P: "low", K: "high", recommendation: "Foliar spray 2% DAP" },
      pod_formation: { N: "none", P: "low", K: "medium", recommendation: "Potash if needed" },
    },
    organic_options: ["Rhizobium inoculation", "FYM", "Rock phosphate"],
  },
  {
    crop: ["mustard", "rapeseed"],
    growth_stages: {
      seedling: { N: "medium", P: "high", K: "medium", recommendation: "NPK + Sulphur" },
      vegetative: { N: "high", P: "low", K: "low", recommendation: "Urea top dressing" },
      flowering: { N: "low", P: "low", K: "medium", recommendation: "Foliar boron spray" },
      pod_formation: { N: "none", P: "low", K: "medium", recommendation: "No nitrogen" },
    },
    organic_options: ["FYM", "Vermicompost", "Neem cake"],
  },
  {
    crop: ["potato"],
    growth_stages: {
      seedling: { N: "medium", P: "high", K: "high", recommendation: "Full P & K at planting" },
      vegetative: { N: "high", P: "low", K: "medium", recommendation: "Urea at earthing up" },
      tuber_initiation: { N: "medium", P: "low", K: "high", recommendation: "Potash important" },
      tuber_bulking: { N: "low", P: "low", K: "high", recommendation: "Stop nitrogen early" },
    },
    organic_options: ["FYM", "Vermicompost", "Wood ash for potash"],
  },
];

interface FertilizerInput {
  crop_name: string;
  growth_stage: string;
  soil_type?: string;
  language?: string;
}

function findCropFertilizerInfo(cropName: string) {
  const crop = cropName.toLowerCase();
  return fertilizerDatabase.find(f => 
    f.crop.some(c => crop.includes(c.toLowerCase()) || c.toLowerCase().includes(crop))
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: FertilizerInput = await req.json();
    
    if (!input.crop_name || !input.growth_stage) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: crop_name, growth_stage" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const cropInfo = findCropFertilizerInfo(input.crop_name);
    const lang = input.language || "en";

    const langInstructions = {
      hi: "जवाब हिंदी में दें। सरल शब्दों का प्रयोग करें जो किसान समझ सकें।",
      te: "తెలుగులో సమాధానం ఇవ్వండి. రైతులు అర్థం చేసుకోగల సరళమైన పదాలు ఉపయోగించండి.",
      en: "Respond in simple English that farmers can easily understand."
    };

    const systemPrompt = `You are a helpful fertilizer expert for Indian farmers. Give SHORT, SIMPLE advice.

RULES:
1. Respond ONLY in valid JSON format
2. Keep each point to 1 SHORT sentence (max 15 words)
3. Use simple words, no technical jargon
4. Maximum 3 points per section
5. ${langInstructions[lang as keyof typeof langInstructions] || langInstructions.en}
6. NEVER give exact dosage amounts - direct farmers to agriculture officers for dosage
7. Mention fertilizer NAMES only, not quantities

OUTPUT FORMAT (strict JSON):
{
  "primary_fertilizers": ["Fertilizer 1", "Fertilizer 2"],
  "application_method": "how to apply briefly",
  "timing": "when to apply",
  "organic_alternatives": ["Option 1", "Option 2"],
  "micronutrients": ["if any deficiency signs"],
  "tips": ["tip 1", "tip 2", "tip 3"],
  "warning": "one safety/timing warning",
  "consult_note": "remind to consult agriculture officer for dosage"
}`;

    const cropContext = cropInfo 
      ? `Known info for ${input.crop_name}: Stage ${input.growth_stage} typically needs ${JSON.stringify(cropInfo.growth_stages)}. Organic options: ${cropInfo.organic_options.join(", ")}`
      : `Crop: ${input.crop_name} - provide general fertilizer guidance`;

    const userPrompt = `Crop: ${input.crop_name}
Growth Stage: ${input.growth_stage}
${input.soil_type ? `Soil: ${input.soil_type}` : ''}

${cropContext}

Give simple fertilizer advice for this stage.`;

    const response = await fetch("https://ai.gateway.openrouter.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
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
      // Fallback response
      return new Response(
        JSON.stringify({
          primary_fertilizers: ["Consult local agriculture officer"],
          application_method: "Based on soil test recommendations",
          timing: "As per crop stage",
          organic_alternatives: cropInfo?.organic_options || ["FYM", "Vermicompost"],
          tips: ["Do soil test before fertilizing", "Follow recommended practices"],
          warning: "Over-fertilization harms soil and crop",
          consult_note: "Visit KVK or agriculture officer for exact dosage"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse AI response
    let advisory;
    try {
      let jsonStr = aiContent;
      const jsonMatch = aiContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonStr = jsonMatch[1];
      }
      advisory = JSON.parse(jsonStr);
    } catch {
      return new Response(
        JSON.stringify({
          primary_fertilizers: ["Consult agriculture officer"],
          application_method: aiContent.substring(0, 200),
          timing: "As per stage",
          organic_alternatives: cropInfo?.organic_options || ["FYM"],
          tips: ["Soil test recommended"],
          warning: "Consult expert for dosage",
          consult_note: "Visit KVK for proper guidance"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(advisory),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("fertilizer-advisory error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
