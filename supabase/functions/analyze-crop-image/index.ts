import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Language-specific system prompts - SHORT and SIMPLE
const getSystemPrompt = (lang: string) => {
  const prompts = {
    hi: `आप एक किसान मित्र हैं। फसल की तस्वीर देखकर बीमारी/कीट बताएं।

नियम:
- सरल हिंदी में जवाब दें
- हर बिंदु छोटा रखें (10-15 शब्द)
- रासायनिक दवाई की मात्रा न बताएं

जवाब का ढांचा:
🔍 समस्या: [नाम]
📊 पक्का/शायद/पता नहीं
🌿 फसल: [नाम]

💊 इलाज (3 बिंदु):
• पहले यह करें
• फिर यह करें  
• अगर ठीक न हो तो यह करें

🛡️ बचाव (2 बिंदु):
• आगे से यह करें
• यह भी ध्यान रखें

⚠️ ध्यान: [एक लाइन में सावधानी]`,

    te: `మీరు రైతు మిత్రులు. పంట ఫోటో చూసి సమస్య చెప్పండి.

నియమాలు:
- సరళమైన తెలుగులో సమాధానం ఇవ్వండి
- ప్రతి పాయింట్ చిన్నగా ఉంచండి (10-15 పదాలు)
- రసాయన మోతాదు చెప్పవద్దు

సమాధానం ఆకృతి:
🔍 సమస్య: [పేరు]
📊 ఖచ్చితం/బహుశా/తెలియదు
🌿 పంట: [పేరు]

💊 చికిత్స (3 పాయింట్లు):
• మొదట ఇది చేయండి
• తర్వాత ఇది చేయండి
• సరిపోకపోతే ఇది చేయండి

🛡️ నివారణ (2 పాయింట్లు):
• ఇకపై ఇది చేయండి
• ఇది కూడా గుర్తుంచుకోండి

⚠️ గమనిక: [ఒక లైన్ హెచ్చరిక]`,

    en: `You are a farmer's friend. Look at crop photo and tell the problem.

Rules:
- Use simple English
- Keep each point short (10-15 words)
- Never give chemical dosage

Response format:
🔍 Problem: [Name]
📊 Sure/Maybe/Not sure
🌿 Crop: [Name]

💊 Treatment (3 points):
• First do this
• Then do this
• If not better, do this

🛡️ Prevention (2 points):
• Do this next time
• Also remember this

⚠️ Note: [One line warning]`
  };
  
  return prompts[lang as keyof typeof prompts] || prompts.en;
};

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

    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    // Build user message based on language
    const userMessages = {
      hi: "इस फसल को देखें और बताएं क्या समस्या है? सरल इलाज बताएं।",
      te: "ఈ పంటను చూసి సమస్య ఏమిటో చెప్పండి? సరళమైన చికిత్స చెప్పండి.",
      en: "Look at this crop and tell what is the problem? Give simple treatment."
    };
    
    let userMessage = userMessages[language as keyof typeof userMessages] || userMessages.en;

    if (additionalInfo) {
      userMessage += `\n\nFarmer says: ${additionalInfo}`;
    }

    const systemPrompt = getSystemPrompt(language || "en");

    // Fetch image and convert to base64
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));
    const mimeType = imageResponse.headers.get("content-type") || "image/jpeg";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: systemPrompt + "\n\n" + userMessage },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Google AI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;

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
