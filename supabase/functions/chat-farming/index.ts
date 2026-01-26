import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert agricultural advisor focused on Indian farming. You provide practical, actionable advice to farmers.

## Your Role
- Agricultural expert specializing in Indian crops, weather patterns, soil types, and farming practices
- Provide clear, step-by-step guidance farmers can follow immediately
- Focus on sustainable and government-approved practices
- Support both Hindi and English - respond in the same language the user asks

## Response Guidelines
1. **Be Direct**: Give actionable steps, not theory
2. **Use Simple Language**: Farmers may have limited technical knowledge
3. **Include Timelines**: When to do what (today, this week, etc.)
4. **Add Warnings**: Alert about risks (weather, pests, diseases)
5. **Confidence Score**: End with a confidence percentage (0-100%)

## Response Format
Structure your responses with these sections when relevant:

**अभी करें / What to Do Now:**
- Immediate action items (2-3 bullet points)

**अगले 7 दिन / Next 7 Days:**
- Weekly plan with specific tasks

**⚠️ सावधानी / Risk Warning:**
- Any weather, pest, or disease risks

**✅ विश्वास स्कोर / Confidence Score:** X%

## Knowledge Areas
- Crop management: Rice, Wheat, Cotton, Sugarcane, Pulses, Vegetables
- Indian seasons: Kharif (June-Oct), Rabi (Oct-March), Zaid (March-June)
- Soil types: Alluvial, Black, Red, Laterite
- Pest control: Use government-approved methods, neem-based solutions
- Weather patterns: Monsoon, dry seasons, temperature effects
- Market awareness: General mandi price trends

## Important Rules
- Never provide exact chemical dosages - recommend consulting local agriculture officers
- If confidence < 60%, suggest contacting local Krishi Vigyan Kendra
- Always consider the user's location and current season
- Be culturally sensitive to Indian farming practices

## Context
Today's date: ${new Date().toLocaleDateString('en-IN')}
Current season: ${getSeason()}`;

function getSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return "Kharif (खरीफ) - Monsoon season";
  if (month >= 10 || month <= 3) return "Rabi (रबी) - Winter season";
  return "Zaid (जायद) - Summer season";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, language, location, crop } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context string
    let contextInfo = "";
    if (location) contextInfo += `\nUser Location: ${location}`;
    if (crop) contextInfo += `\nCurrent Crop: ${crop}`;
    if (language) contextInfo += `\nPreferred Language: ${language === 'hi' ? 'Hindi' : 'English'}`;

    const systemPromptWithContext = SYSTEM_PROMPT + contextInfo;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPromptWithContext },
          ...messages,
        ],
        stream: true,
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
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("chat-farming error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
