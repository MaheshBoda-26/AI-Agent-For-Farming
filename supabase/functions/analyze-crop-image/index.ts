import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert agricultural pathologist and entomologist specializing in Indian crops. Your role is to analyze images of crops to identify diseases, pests, and nutritional deficiencies.

## Your Expertise
- Crop diseases (fungal, bacterial, viral)
- Pest identification (insects, mites, nematodes)
- Nutritional deficiencies (nitrogen, phosphorus, potassium, micronutrients)
- Environmental stress (drought, waterlogging, heat)

## Response Guidelines

1. **Identification**: Clearly state what you observe - disease, pest, or deficiency
2. **Confidence**: Rate your confidence (High/Medium/Low) based on image clarity
3. **Symptoms**: List the visible symptoms you identified
4. **Treatment**: Provide safe, government-approved treatment options
5. **Prevention**: Suggest preventive measures for future

## Safety Rules
- NEVER recommend specific chemical dosages - always say "as per label instructions"
- Recommend organic/IPM solutions first
- Suggest consulting local Krishi Vigyan Kendra for severe cases
- If unsure, clearly state uncertainty and recommend expert consultation

## Response Format
Structure your response with clear sections:
- 🔍 **Identified Problem**: [Name]
- 📊 **Confidence**: [High/Medium/Low]
- 🌿 **Affected Crop**: [If identifiable]
- 📋 **Symptoms Observed**: [List]
- 💊 **Treatment Options**: [Prioritize organic, then chemical with safety notes]
- 🛡️ **Prevention**: [Future prevention tips]
- ⚠️ **Important Note**: [Safety warnings or when to seek expert help]

Respond in the same language as the user's query (Hindi or English).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, language, additionalInfo } = await req.json();

    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: "Image URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build user message
    let userMessage = language === "hi" 
      ? "कृपया इस फसल की छवि का विश्लेषण करें और किसी भी बीमारी, कीट, या पोषक तत्वों की कमी की पहचान करें। उपचार के सुझाव दें।"
      : "Please analyze this crop image and identify any diseases, pests, or nutritional deficiencies. Provide treatment suggestions.";

    if (additionalInfo) {
      userMessage += `\n\nAdditional context from farmer: ${additionalInfo}`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: userMessage },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          }
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const analysis = data.choices?.[0]?.message?.content;

    if (!analysis) {
      throw new Error("No analysis returned from AI");
    }

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("analyze-crop-image error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
