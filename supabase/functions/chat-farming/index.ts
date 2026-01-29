import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Language-specific system prompts - SHORT and SIMPLE
const getSystemPrompt = (lang: string) => {
  const season = getSeason();
  const date = new Date().toLocaleDateString('en-IN');
  
  const prompts = {
    hi: `आप किसान मित्र AI हैं। सरल हिंदी में जवाब दें।

नियम:
• हर बिंदु छोटा रखें (10-15 शब्द)
• बहुत सरल भाषा में बोलें
• रासायनिक दवाई की मात्रा न बताएं
• ज्यादा से ज्यादा 5 बिंदु दें

जवाब का ढांचा:
**अभी करें:** (2-3 बिंदु)
• करने का काम

**अगले 7 दिन:** (2-3 बिंदु)  
• हफ्ते का काम

**⚠️ सावधानी:** (1 बिंदु)
• एक चेतावनी

आज: ${date}
मौसम: ${season}`,

    te: `మీరు కిసాన్ మిత్ర AI. సరళమైన తెలుగులో సమాధానం ఇవ్వండి.

నియమాలు:
• ప్రతి పాయింట్ చిన్నగా ఉంచండి (10-15 పదాలు)
• చాలా సరళమైన భాషలో మాట్లాడండి
• రసాయన మోతాదు చెప్పవద్దు
• గరిష్టంగా 5 పాయింట్లు ఇవ్వండి

సమాధానం ఆకృతి:
**ఇప్పుడే చేయండి:** (2-3 పాయింట్లు)
• చేయాల్సిన పని

**వచ్చే 7 రోజులు:** (2-3 పాయింట్లు)
• వారపు పని

**⚠️ జాగ్రత్త:** (1 పాయింట్)
• ఒక హెచ్చరిక

ఈ రోజు: ${date}
సీజన్: ${season}`,

    en: `You are Kisan Mitra AI. Give simple English answers.

Rules:
• Keep each point short (10-15 words)
• Use very simple language
• Never give chemical dosage
• Maximum 5 points total

Response format:
**Do Now:** (2-3 points)
• Action to take

**Next 7 Days:** (2-3 points)
• Weekly tasks

**⚠️ Warning:** (1 point)
• One caution

Today: ${date}
Season: ${season}`
  };
  
  return prompts[lang as keyof typeof prompts] || prompts.en;
};

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
    
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");
    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    // Build context string
    let contextInfo = "";
    if (location) contextInfo += `\nUser Location: ${location}`;
    if (crop) contextInfo += `\nCurrent Crop: ${crop}`;
    if (language) contextInfo += `\nPreferred Language: ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}`;

    const systemPromptWithContext = getSystemPrompt(language || "en") + contextInfo;

    // Convert messages to Gemini format
    const geminiContents = [];
    
    // Add system instruction as first user message context
    geminiContents.push({
      role: "user",
      parts: [{ text: systemPromptWithContext + "\n\nPlease follow the above instructions for all responses." }]
    });
    geminiContents.push({
      role: "model",
      parts: [{ text: "I understand. I will follow these instructions and respond accordingly." }]
    });

    // Add conversation messages
    for (const msg of messages) {
      geminiContents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GOOGLE_AI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: geminiContents,
          generationConfig: {
            temperature: 0.7,
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
        JSON.stringify({ error: "Failed to get AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Transform Gemini SSE format to OpenAI-compatible format
    const reader = response.body?.getReader();
    const encoder = new TextEncoder();
    
    const transformedStream = new ReadableStream({
      async start(controller) {
        if (!reader) {
          controller.close();
          return;
        }
        
        const decoder = new TextDecoder();
        let buffer = "";
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const jsonStr = line.slice(6).trim();
                if (jsonStr === "[DONE]") continue;
                
                try {
                  const parsed = JSON.parse(jsonStr);
                  const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                  
                  if (text) {
                    // Convert to OpenAI-compatible SSE format
                    const openAIFormat = {
                      choices: [{
                        delta: { content: text }
                      }]
                    };
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(openAIFormat)}\n\n`));
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
          
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(transformedStream, {
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
