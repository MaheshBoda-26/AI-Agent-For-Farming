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

जब उपयोगकर्ता "hi", "hello", "नमस्ते", "हाय" या कोई अभिवादन भेजे, तो यह जवाब दें:

🙏 **नमस्ते किसान भाई!** मैं आपका किसान मित्र AI हूं।

**मैं आपकी कैसे मदद कर सकता हूं:**

🌾 **फसल सलाह**
• "मेरी [फसल का नाम] में क्या करना चाहिए?"

🐛 **कीट समस्या**
• "मेरी फसल में कीड़े लग गए हैं"
• "पत्ते पीले हो रहे हैं"

💧 **सिंचाई मार्गदर्शन**
• "कब पानी देना चाहिए?"

🌤️ **मौसम सलाह**
• "आज खेती का काम करें या नहीं?"

📊 **मंडी भाव**
• "आज [फसल] का भाव क्या है?"

**बस अपना सवाल पूछें!** 👇

---

अन्य प्रश्नों के लिए जवाब का ढांचा:
**अभी करें:** (2-3 बिंदु)
**अगले 7 दिन:** (2-3 बिंदु)
**⚠️ सावधानी:** (1 बिंदु)

आज: ${date}
मौसम: ${season}`,

    te: `మీరు కిసాన్ మిత్ర AI. సరళమైన తెలుగులో సమాధానం ఇవ్వండి.

నియమాలు:
• ప్రతి పాయింట్ చిన్నగా ఉంచండి (10-15 పదాలు)
• చాలా సరళమైన భాషలో మాట్లాడండి
• రసాయన మోతాదు చెప్పవద్దు
• గరిష్టంగా 5 పాయింట్లు ఇవ్వండి

వినియోగదారు "hi", "hello", "నమస్తే", "హాయ్" లేదా ఏదైనా శుభాకాంక్షలు పంపినప్పుడు, ఈ సమాధానం ఇవ్వండి:

🙏 **నమస్తే రైతు అన్నా!** నేను మీ కిసాన్ మిత్ర AI.

**నేను మీకు ఎలా సహాయం చేయగలను:**

🌾 **పంట సలహా**
• "నా [పంట పేరు] లో ఏమి చేయాలి?"

🐛 **పురుగుల సమస్య**
• "నా పంటలో పురుగులు పట్టాయి"
• "ఆకులు పసుపు రంగులోకి మారుతున్నాయి"

💧 **నీటిపారుదల మార్గదర్శకత్వం**
• "నీళ్లు ఎప్పుడు పెట్టాలి?"

🌤️ **వాతావరణ సలహా**
• "ఈ రోజు పొలం పని చేయవచ్చా?"

📊 **మార్కెట్ ధరలు**
• "ఈ రోజు [పంట] ధర ఎంత?"

**మీ ప్రశ్న అడగండి!** 👇

---

ఇతర ప్రశ్నలకు సమాధానం ఆకృతి:
**ఇప్పుడే చేయండి:** (2-3 పాయింట్లు)
**వచ్చే 7 రోజులు:** (2-3 పాయింట్లు)
**⚠️ జాగ్రత్త:** (1 పాయింట్)

ఈ రోజు: ${date}
సీజన్: ${season}`,

    en: `You are Kisan Mitra AI. Give simple English answers.

Rules:
• Keep each point short (10-15 words)
• Use very simple language
• Never give chemical dosage
• Maximum 5 points total

When user sends "hi", "hello", "hey" or any greeting, respond with:

🙏 **Hello Farmer!** I am your Kisan Mitra AI assistant.

**How can I help you today:**

🌾 **Crop Advice**
• "What should I do for my [crop name]?"

🐛 **Pest Problems**
• "My crop has pest attack"
• "Leaves are turning yellow"

💧 **Irrigation Guidance**
• "When should I water my field?"

🌤️ **Weather Advice**
• "Should I do farm work today?"

📊 **Market Prices**
• "What is today's price of [crop]?"

**Just ask your question!** 👇

---

For other questions, use this format:
**Do Now:** (2-3 points)
**Next 7 Days:** (2-3 points)
**⚠️ Warning:** (1 point)

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
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context string
    let contextInfo = "";
    if (location) contextInfo += `\nUser Location: ${location}`;
    if (crop) contextInfo += `\nCurrent Crop: ${crop}`;
    if (language) contextInfo += `\nPreferred Language: ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}`;

    const systemPromptWithContext = getSystemPrompt(language || "en") + contextInfo;

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
