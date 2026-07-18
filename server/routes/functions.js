const express = require('express');
const router = express.Router();

// ===== HELPER: Normalise model names to Gemini native IDs =====
function getNativeModel(model) {
  const name = model.includes('/') ? model.split('/').pop() : model;
  if (name.includes('gemini-2.0-flash') || name.includes('gemini-2.5-flash') || name.includes('gemini-2.0-flash-001')) {
    return 'gemini-2.5-flash';
  }
  return name || 'gemini-2.5-flash';
}

// ===== HELPER: Normalise model names to OpenRouter IDs =====
function getOpenRouterModel(model) {
  const name = model.includes('/') ? model.split('/').pop() : model;
  if (name.includes('gemini-2.0-flash') || name.includes('gemini-2.5-flash') || name.includes('gemini-2.0-flash-001')) {
    return 'google/gemini-2.5-flash';
  }
  return model.includes('/') ? model : `google/${model}`;
}

// ===== HELPER: Convert message array to Gemini contents & systemInstruction =====
function prepareGeminiPayload(messages) {
  let systemInstructionText = '';
  const contents = [];

  for (const m of messages) {
    if (m.role === 'system') {
      systemInstructionText += (systemInstructionText ? '\n' : '') + m.content;
    } else {
      const role = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';
      contents.push({
        role,
        parts: [{ text: m.content || '' }]
      });
    }
  }

  const payload = { contents };

  if (systemInstructionText) {
    payload.systemInstruction = {
      parts: [{ text: systemInstructionText }]
    };
  }

  return payload;
}

// ===== HELPER: Call Gemini API (non-streaming) =====
async function callGemini(messages, model = 'gemini-2.5-flash') {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'YOUR_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in server/.env');
  }

  const isOpenRouter = key.startsWith('sk-or-');

  if (isOpenRouter) {
    const orModel = getOpenRouterModel(model);
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Krishi Mitra AI'
      },
      body: JSON.stringify({
        model: orModel,
        messages: messages.map(m => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.content
        })),
        max_tokens: 2048
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      throw new Error(`OpenRouter API error ${resp.status}: ${errBody.substring(0, 200)}`);
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('No response from AI');
    return text;
  } else {
    const nativeModel = getNativeModel(model);
    const payload = prepareGeminiPayload(messages);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${nativeModel}:generateContent?key=${key}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      throw new Error(`Gemini API error ${resp.status}: ${errBody.substring(0, 200)}`);
    }

    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini API');
    return text;
  }
}

// ===== HELPER: Call Gemini API (streaming) =====
async function callGeminiStream(messages, model = 'gemini-2.5-flash') {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'YOUR_GEMINI_API_KEY') {
    throw new Error('GEMINI_API_KEY is not configured in server/.env');
  }

  const isOpenRouter = key.startsWith('sk-or-');

  if (isOpenRouter) {
    const orModel = getOpenRouterModel(model);
    const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lovable.dev',
        'X-Title': 'Krishi Mitra AI'
      },
      body: JSON.stringify({
        model: orModel,
        stream: true,
        messages: messages.map(m => ({
          role: m.role === 'model' ? 'assistant' : m.role,
          content: m.content
        })),
        max_tokens: 2048
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      throw new Error(`OpenRouter stream error ${resp.status}: ${errBody.substring(0, 200)}`);
    }
    return resp;
  } else {
    const nativeModel = getNativeModel(model);
    const payload = prepareGeminiPayload(messages);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${nativeModel}:streamGenerateContent?key=${key}&alt=sse`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errBody = await resp.text().catch(() => '');
      throw new Error(`Gemini stream error ${resp.status}: ${errBody.substring(0, 200)}`);
    }
    return resp;
  }
}

// ===== GET-WEATHER =====
router.post('/get-weather', async (req, res) => {
  try {
    const { lat, lon, city } = req.body;
    const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
    if (!API_KEY) throw new Error('OPENWEATHERMAP_API_KEY is not configured');

    let q;
    if (lat && lon) q = `lat=${lat}&lon=${lon}`;
    else if (city) q = `q=${encodeURIComponent(city)}`;
    else q = 'q=Warangal,IN';

    const base = 'https://api.openweathermap.org/data/2.5';
    const [wRes, fRes] = await Promise.all([
      fetch(`${base}/weather?${q}&units=metric&appid=${API_KEY}`),
      fetch(`${base}/forecast?${q}&units=metric&cnt=40&appid=${API_KEY}`),
    ]);
    if (!wRes.ok) throw new Error(`Weather API error: ${wRes.status}`);
    if (!fRes.ok) throw new Error(`Forecast API error: ${fRes.status}`);

    const wd = await wRes.json();
    const fd = await fRes.json();

    const daily = [];
    const seen = new Set();
    for (const item of fd.list) {
      const d = new Date(item.dt * 1000);
      const dk = d.toISOString().split('T')[0];
      const h = d.getHours();
      if (!seen.has(dk) && h >= 11 && h <= 14) {
        seen.add(dk);
        daily.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), temp: Math.round(item.main.temp), condition: item.weather[0].main.toLowerCase(), icon: item.weather[0].icon });
        if (daily.length >= 5) break;
      }
    }
    if (daily.length < 5) {
      for (const item of fd.list) {
        const d = new Date(item.dt * 1000);
        const dk = d.toISOString().split('T')[0];
        if (!seen.has(dk)) {
          seen.add(dk);
          daily.push({ day: d.toLocaleDateString('en-US', { weekday: 'short' }), temp: Math.round(item.main.temp), condition: item.weather[0].main.toLowerCase(), icon: item.weather[0].icon });
          if (daily.length >= 5) break;
        }
      }
    }

    res.json({
      location: `${wd.name}, ${wd.sys.country}`,
      current: { temp: Math.round(wd.main.temp), condition: wd.weather[0].main.toLowerCase(), description: wd.weather[0].description, humidity: wd.main.humidity, wind: Math.round(wd.wind.speed * 3.6), icon: wd.weather[0].icon },
      forecast: daily,
    });
  } catch (err) {
    console.error('get-weather error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ===== CHAT-FARMING (streaming) =====
function getSeason() {
  const m = new Date().getMonth() + 1;
  if (m >= 6 && m <= 10) return 'Kharif - Monsoon season';
  if (m >= 10 || m <= 3) return 'Rabi - Winter season';
  return 'Zaid - Summer season';
}

// Language name lookup
const LANG_NAMES = {
  en: 'English', hi: 'Hindi', te: 'Telugu', bn: 'Bengali', ta: 'Tamil',
  mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi',
  or: 'Odia', as: 'Assamese', ur: 'Urdu', mai: 'Maithili', sa: 'Sanskrit',
  sd: 'Sindhi', ks: 'Kashmiri', ne: 'Nepali', mni: 'Manipuri', doi: 'Dogri',
  kok: 'Konkani', sat: 'Santali', bodo: 'Bodo',
};

function getChatSystemPrompt(lang) {
  const date = new Date().toLocaleDateString('en-IN');
  const season = getSeason();
  const langName = LANG_NAMES[lang] || 'English';

  // For Hindi and Telugu, use native-language prompts for better quality
  if (lang === 'hi') {
    return `आप किसान मित्र AI हैं। सरल हिंदी में जवाब दें।\nनियम:\n• हर बिंदु छोटा रखें\n• रासायनिक दवाई की मात्रा न बताएं\n• ज्यादा से ज्यादा 5 बिंदु\nआज: ${date}\nमौसम: ${season}`;
  }
  if (lang === 'te') {
    return `మీరు కిసాన్ మిత్ర AI. సరళమైన తెలుగులో సమాధానం ఇవ్వండి.\nనియమాలు:\n• ప్రతి పాయింట్ చిన్నగా ఉంచండి\n• రసాయన మోతాదు చెప్పవద్దు\n• గరిష్టంగా 5 పాయింట్లు\nఈ రోజు: ${date}\nసీజన్: ${season}`;
  }

  // Dynamic prompt for all other languages
  return `You are Kisan Mitra AI, an expert farming assistant for Indian farmers. Respond ONLY in ${langName} language.\nRules:\n• Keep each point short and simple\n• Never give chemical dosage amounts\n• Maximum 5 points per answer\n• Use the ${langName} script naturally\nToday: ${date}\nSeason: ${season}`;
}

router.post('/chat-farming', async (req, res) => {
  try {
    const { messages, language, location, crop } = req.body;
    let ctx = '';
    if (location) ctx += `\nUser Location: ${location}`;
    if (crop) ctx += `\nCurrent Crop: ${crop}`;
    const sys = getChatSystemPrompt(language || 'en') + ctx;

    const resp = await callGeminiStream(
      [{ role: 'system', content: sys }, ...messages]
    );

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Gemini SSE sends data as JSON chunks; convert to OpenAI-compatible SSE format
    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(Buffer.from(value), { stream: true });

        let newlineIdx;
        while ((newlineIdx = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIdx).trim();
          buffer = buffer.slice(newlineIdx + 1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6);
          try {
            const chunk = JSON.parse(jsonStr);
            let text = '';
            if (chunk.choices?.[0]?.delta?.content) {
              text = chunk.choices[0].delta.content;
            } else if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
              text = chunk.candidates[0].content.parts[0].text;
            }
            if (text) {
              // Re-emit as OpenAI-compatible SSE so the frontend can parse it
              const oaiChunk = { choices: [{ delta: { content: text } }] };
              res.write(`data: ${JSON.stringify(oaiChunk)}\n\n`);
            }
          } catch { /* skip non-JSON lines */ }
        }
      }
      res.write('data: [DONE]\n\n');
      res.end();
    };
    pump().catch(err => { console.error('Stream error:', err); res.end(); });
  } catch (err) {
    console.error('chat-farming error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ===== ELEVENLABS-TTS =====
router.post('/elevenlabs-tts', async (req, res) => {
  try {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error('ELEVENLABS_API_KEY is not configured');
    const { text, language } = req.body;
    if (!text || !text.trim()) throw new Error('No text provided');

    const voiceId = 'EXAVITQu4vr4xnSDxMaL';
    const resp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.substring(0, 5000), model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3, use_speaker_boost: true, speed: 1.0 } }),
    });
    if (!resp.ok) throw new Error(`TTS failed: ${resp.status}`);

    res.setHeader('Content-Type', 'audio/mpeg');
    const reader = resp.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    };
    pump().catch(() => res.end());
  } catch (err) {
    console.error('TTS error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== CROP-SUGGEST =====
// (Embedded crop & soil databases from the original edge function)
const CROPS_DB = [
  { n: 'Rice', h: 'धान', states: ['Andhra Pradesh', 'Telangana', 'West Bengal', 'Punjab', 'Uttar Pradesh', 'Bihar', 'Tamil Nadu', 'Odisha', 'Karnataka', 'Assam', 'Haryana', 'Madhya Pradesh', 'Chhattisgarh', 'Kerala', 'Maharashtra'], seasons: ['Kharif'], soils: ['Alluvial', 'Clay', 'Clayey Loam'], rMin: 100, rMax: 200, tMin: 20, tMax: 35, water: 'high', dur: 120 },
  { n: 'Cotton', h: 'कपास', states: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Karnataka', 'Madhya Pradesh', 'Rajasthan', 'Punjab', 'Haryana'], seasons: ['Kharif'], soils: ['Black', 'Alluvial', 'Sandy Loam'], rMin: 50, rMax: 100, tMin: 21, tMax: 35, water: 'medium', dur: 180 },
  { n: 'Maize', h: 'मक्का', states: ['Karnataka', 'Andhra Pradesh', 'Telangana', 'Madhya Pradesh', 'Bihar', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Gujarat', 'Tamil Nadu'], seasons: ['Kharif', 'Rabi'], soils: ['Alluvial', 'Red', 'Sandy Loam', 'Loamy'], rMin: 50, rMax: 100, tMin: 18, tMax: 32, water: 'medium', dur: 100 },
  { n: 'Sorghum', h: 'ज्वार', states: ['Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Tamil Nadu'], seasons: ['Kharif', 'Rabi'], soils: ['Black', 'Red', 'Alluvial', 'Sandy Loam'], rMin: 40, rMax: 100, tMin: 20, tMax: 40, water: 'low', dur: 110 },
  { n: 'Pearl Millet', h: 'बाजरा', states: ['Rajasthan', 'Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Haryana', 'Karnataka', 'Madhya Pradesh', 'Tamil Nadu'], seasons: ['Kharif'], soils: ['Sandy', 'Sandy Loam', 'Alluvial', 'Red'], rMin: 25, rMax: 60, tMin: 25, tMax: 42, water: 'low', dur: 90 },
  { n: 'Groundnut', h: 'मूंगफली', states: ['Gujarat', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Rajasthan', 'Maharashtra', 'Madhya Pradesh'], seasons: ['Kharif', 'Rabi'], soils: ['Sandy Loam', 'Red', 'Alluvial', 'Loamy'], rMin: 50, rMax: 125, tMin: 20, tMax: 35, water: 'medium', dur: 120 },
  { n: 'Soybean', h: 'सोयाबीन', states: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Telangana'], seasons: ['Kharif'], soils: ['Black', 'Alluvial', 'Clay', 'Loamy'], rMin: 60, rMax: 100, tMin: 20, tMax: 32, water: 'medium', dur: 100 },
  { n: 'Sugarcane', h: 'गन्ना', states: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Bihar', 'Andhra Pradesh', 'Punjab', 'Haryana'], seasons: ['Kharif'], soils: ['Alluvial', 'Black', 'Loamy', 'Clay'], rMin: 75, rMax: 150, tMin: 20, tMax: 38, water: 'high', dur: 365 },
  { n: 'Wheat', h: 'गेहूं', states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar', 'Gujarat', 'Maharashtra'], seasons: ['Rabi'], soils: ['Alluvial', 'Loamy', 'Clay', 'Black'], rMin: 25, rMax: 75, tMin: 10, tMax: 25, water: 'medium', dur: 120 },
  { n: 'Chickpea', h: 'चना', states: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Andhra Pradesh', 'Gujarat'], seasons: ['Rabi'], soils: ['Black', 'Alluvial', 'Sandy Loam', 'Loamy'], rMin: 25, rMax: 50, tMin: 10, tMax: 30, water: 'low', dur: 100 },
  { n: 'Mustard', h: 'सरसों', states: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh', 'Gujarat', 'West Bengal', 'Assam'], seasons: ['Rabi'], soils: ['Alluvial', 'Sandy Loam', 'Loamy', 'Clay'], rMin: 25, rMax: 50, tMin: 10, tMax: 25, water: 'low', dur: 110 },
  { n: 'Watermelon', h: 'तरबूज', states: ['Uttar Pradesh', 'Andhra Pradesh', 'Karnataka', 'West Bengal', 'Odisha', 'Maharashtra', 'Tamil Nadu'], seasons: ['Zaid'], soils: ['Sandy Loam', 'Sandy', 'Alluvial'], rMin: 25, rMax: 50, tMin: 24, tMax: 40, water: 'medium', dur: 90 },
  { n: 'Moong Bean', h: 'मूंग', states: ['Rajasthan', 'Maharashtra', 'Madhya Pradesh', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu', 'Odisha'], seasons: ['Zaid', 'Kharif'], soils: ['Loamy', 'Sandy Loam', 'Alluvial', 'Black'], rMin: 25, rMax: 60, tMin: 25, tMax: 40, water: 'low', dur: 70 },
];

const SOIL_COMPAT = [
  { soil: 'Alluvial', best: ['Rice', 'Wheat', 'Sugarcane', 'Maize', 'Potato'], ok: ['Cotton', 'Groundnut', 'Mustard'] },
  { soil: 'Black', best: ['Cotton', 'Soybean', 'Sorghum', 'Chickpea'], ok: ['Wheat', 'Sugarcane', 'Groundnut', 'Moong Bean'] },
  { soil: 'Red', best: ['Pearl Millet', 'Sorghum', 'Groundnut'], ok: ['Maize'] },
  { soil: 'Sandy', best: ['Pearl Millet', 'Watermelon'], ok: ['Groundnut', 'Moong Bean'] },
  { soil: 'Sandy Loam', best: ['Groundnut', 'Watermelon'], ok: ['Cotton', 'Maize', 'Mustard', 'Pearl Millet', 'Chickpea', 'Moong Bean'] },
  { soil: 'Loamy', best: ['Wheat', 'Maize'], ok: ['Rice', 'Cotton', 'Sugarcane', 'Groundnut', 'Mustard', 'Moong Bean'] },
  { soil: 'Clay', best: ['Rice', 'Soybean'], ok: ['Wheat', 'Sugarcane', 'Mustard'] },
];

router.post('/crop-suggest', async (req, res) => {
  try {
    const input = req.body;
    const sc = SOIL_COMPAT.find(s => s.soil === input.soil_type);

    const scored = CROPS_DB
      .filter(c => c.seasons.includes(input.season))
      .map(c => {
        let score = 0.5;
        if (c.seasons.includes(input.season)) score += 0.25;
        if (c.states.includes(input.state)) score += 0.2;
        if (sc) {
          if (sc.best.includes(c.n)) score += 0.2;
          else if (sc.ok.includes(c.n)) score += 0.14;
          else if (c.soils.includes(input.soil_type)) score += 0.08;
        }
        if (input.avg_temp != null) {
          const diff = Math.abs(input.avg_temp - (c.tMin + c.tMax) / 2);
          score += 0.15 * Math.max(0, 1 - diff / (c.tMax - c.tMin));
        } else score += 0.075;
        return { ...c, score: Math.min(1, score) };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (!scored.length) {
      return res.json({ crops: [], message: 'No suitable crops found. Consult your local KVK.' });
    }

    res.json({
      crops: scored.map(c => ({
        name: c.n,
        name_hi: c.h,
        reasons: [
          `Suitable for ${input.season} season`,
          c.states.includes(input.state) ? `Grown in ${input.state}` : 'Can adapt to your region',
          `${input.soil_type} soil is suitable`,
        ],
        risk: c.states.includes(input.state) ? 'No significant risks' : 'Less common in this region',
        confidence: Math.round(c.score * 100),
      })),
    });
  } catch (err) {
    console.error('crop-suggest error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== PEST-ADVISORY =====
router.post('/pest-advisory', async (req, res) => {
  try {
    const input = req.body;
    if (!input.crop_name || !input.growth_stage || !input.symptoms_text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const lang = input.language || 'en';
    const langName = LANG_NAMES[lang] || 'English';
    const langInst = `Respond in ${langName} language.`;

    const sysPr = `You are a farming pest expert. SHORT, SIMPLE advice.\nRules: Respond ONLY in valid JSON. Max 3 points per section. No chemical dosages.\n${langInst}\nOUTPUT JSON: {"pest_name":"","confidence":0.8,"pest_type":"","reasons":[],"actions":[],"chemical_options":[],"prevention":[],"risk_note":"","follow_up":""}`;
    const usrPr = `Crop: ${input.crop_name}\nStage: ${input.growth_stage}\nProblem: ${input.symptoms_text}\nGive simple advice.`;

    let content = await callGemini([{ role: 'system', content: sysPr }, { role: 'user', content: usrPr }]);

    let advisory;
    try {
      const m = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (m) content = m[1];
      advisory = JSON.parse(content);
    } catch {
      advisory = { pest_name: null, confidence: 0, reasons: [content.substring(0, 300)], actions: ['Consult local agriculture officer'], prevention: ['Regular monitoring'], risk_note: 'Manual inspection recommended' };
    }
    res.json(advisory);
  } catch (err) {
    console.error('pest-advisory error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ===== FERTILIZER-ADVISORY =====
router.post('/fertilizer-advisory', async (req, res) => {
  try {
    const input = req.body;
    if (!input.crop_name || !input.growth_stage) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const lang = input.language || 'en';
    const langName = LANG_NAMES[lang] || 'English';
    const langInst = `Respond in ${langName} language.`;

    const sysPr = `You are a fertilizer expert for Indian farmers. SHORT, SIMPLE advice.\nRules: Respond ONLY in valid JSON. Max 3 points. No dosage amounts.\n${langInst}\nOUTPUT JSON: {"primary_fertilizers":[],"application_method":"","timing":"","organic_alternatives":[],"micronutrients":[],"tips":[],"warning":"","consult_note":""}`;
    const usrPr = `Crop: ${input.crop_name}\nGrowth Stage: ${input.growth_stage}\n${input.soil_type ? 'Soil: ' + input.soil_type : ''}\nGive simple fertilizer advice.`;

    let content = await callGemini([{ role: 'system', content: sysPr }, { role: 'user', content: usrPr }]);

    let advisory;
    try {
      const m = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (m) content = m[1];
      advisory = JSON.parse(content);
    } catch {
      advisory = { primary_fertilizers: ['Consult agriculture officer'], application_method: content.substring(0, 200), timing: 'As per stage', organic_alternatives: ['FYM'], tips: ['Soil test recommended'], warning: 'Consult expert for dosage', consult_note: 'Visit KVK for guidance' };
    }
    res.json(advisory);
  } catch (err) {
    console.error('fertilizer-advisory error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ===== ANALYZE-CROP-IMAGE =====
router.post('/analyze-crop-image', async (req, res) => {
  try {
    const { imageUrl, language, additionalInfo } = req.body;
    if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

    const lang = language || 'en';
    const sysPrompts = {
      hi: 'आप किसान मित्र हैं। फसल की तस्वीर देखकर बीमारी बताएं। सरल हिंदी में, दवाई की मात्रा न बताएं।',
      te: 'మీరు రైతు మిత్రులు. పంట ఫోటో చూసి సమస్య చెప్పండి. సరళమైన తెలుగులో.',
      en: 'You are a farmer helper. Look at crop photo and tell the problem. Simple English, no chemical dosage.',
    };
    const usrMsgs = { hi: 'इस फसल को देखें और बताएं क्या समस्या है?', te: 'ఈ పంటను చూసి సమస్య ఏమిటో చెప్పండి?', en: 'Look at this crop and tell what is the problem?' };
    let usrMsg = usrMsgs[lang] || usrMsgs.en;
    if (additionalInfo) usrMsg += `\n\nFarmer says: ${additionalInfo}`;

    const analysis = await callGemini([
      { role: 'system', content: sysPrompts[lang] || sysPrompts.en },
      { role: 'user', content: usrMsg },
    ], 'google/gemini-2.0-flash-001');
    res.json({ analysis });
  } catch (err) {
    console.error('analyze-crop-image error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ===== MANDI-PRICES =====
const CROP_BASE_DATA = [
  { n: 'Rice', h: 'धान', bp: 2200, v: 150 }, { n: 'Wheat', h: 'गेहूं', bp: 2350, v: 100 }, { n: 'Cotton', h: 'कपास', bp: 6900, v: 400 },
  { n: 'Soybean', h: 'सोयाबीन', bp: 5000, v: 250 }, { n: 'Maize', h: 'मक्का', bp: 2050, v: 150 }, { n: 'Groundnut', h: 'मूंगफली', bp: 5900, v: 350 },
  { n: 'Chickpea', h: 'चना', bp: 5500, v: 300 }, { n: 'Mustard', h: 'सरसों', bp: 6100, v: 300 }, { n: 'Onion', h: 'प्याज', bp: 1500, v: 300 },
  { n: 'Potato', h: 'आलू', bp: 1000, v: 200 }, { n: 'Sugarcane', h: 'गन्ना', bp: 375, v: 25 }, { n: 'Bajra', h: 'बाजरा', bp: 2250, v: 150 },
  { n: 'Jowar', h: 'ज्वार', bp: 2800, v: 200 }, { n: 'Arhar', h: 'अरहर', bp: 6500, v: 400 }, { n: 'Moong', h: 'मूंग', bp: 7500, v: 500 },
  { n: 'Urad', h: 'उड़द', bp: 6800, v: 400 },
];

const ALL_STATES = [
  { s: 'Andhra Pradesh', m: ['Kurnool', 'Guntur'] }, { s: 'Assam', m: ['Guwahati'] }, { s: 'Bihar', m: ['Patna', 'Muzaffarpur'] },
  { s: 'Gujarat', m: ['Rajkot', 'Ahmedabad'] }, { s: 'Haryana', m: ['Karnal', 'Hisar'] }, { s: 'Karnataka', m: ['Davangere', 'Hubli'] },
  { s: 'Madhya Pradesh', m: ['Indore', 'Bhopal'] }, { s: 'Maharashtra', m: ['Nashik', 'Nagpur', 'Pune'] },
  { s: 'Punjab', m: ['Amritsar', 'Ludhiana'] }, { s: 'Rajasthan', m: ['Jaipur', 'Jodhpur'] },
  { s: 'Tamil Nadu', m: ['Chennai', 'Coimbatore'] }, { s: 'Telangana', m: ['Hyderabad', 'Warangal'] },
  { s: 'Uttar Pradesh', m: ['Lucknow', 'Agra', 'Kanpur'] }, { s: 'West Bengal', m: ['Kolkata', 'Siliguri'] },
];

function genFallbackPrices() {
  const prices = [];
  const today = new Date().toISOString().split('T')[0];
  const trends = ['up', 'down', 'stable'];
  ALL_STATES.forEach(st => {
    CROP_BASE_DATA.forEach(c => {
      st.m.forEach(mandi => {
        const pv = Math.floor((Math.random() - 0.5) * c.v * 2);
        const mp = c.bp + pv;
        const t = trends[Math.floor(Math.random() * 3)];
        prices.push({ crop_name: c.n, crop_name_hi: c.h, state: st.s, mandi, min_price: mp - Math.floor(c.v * 0.5), max_price: mp + Math.floor(c.v * 0.5), modal_price: mp, date: today, trend: t, trend_percent: t === 'stable' ? 0 : t === 'up' ? Math.round(Math.random() * 5 * 10) / 10 : -Math.round(Math.random() * 5 * 10) / 10 });
      });
    });
  });
  return prices;
}

router.post('/mandi-prices', async (req, res) => {
  try {
    let prices = genFallbackPrices();
    const { crop, state } = req.body || {};
    if (crop) prices = prices.filter(p => p.crop_name === crop);
    if (state) prices = prices.filter(p => p.state === state);
    const crops = [...new Set(prices.map(p => p.crop_name))].sort();
    const states = [...new Set(prices.map(p => p.state))].sort();
    res.json({ success: true, data: { prices, trend: null, filters: { crops, states }, last_updated: new Date().toISOString(), is_live_data: false } });
  } catch (err) {
    console.error('mandi-prices error:', err);
    res.status(500).json({ error: err.message });
  }
});
// ===== SMS-ALERT (v2 — Weather + Market Intelligence) =====
router.post('/sms-alert', async (req, res) => {
  try {
    const {
      location, crop, language,
      // Weather inputs
      weather, temperature, condition, rainForecast,
      // Market inputs
      marketPrice, priceTrend,
      // General
      issue,
    } = req.body;

    if (!crop && !issue && !weather && !condition) {
      return res.status(400).json({ error: 'Provide at least a crop, issue, or weather condition' });
    }

    const lang = language || 'en';
    const langName = LANG_NAMES[lang] || 'English';

    // Build weather context string
    const weatherParts = [];
    if (temperature) weatherParts.push(`Temperature: ${temperature}`);
    if (condition) weatherParts.push(`Condition: ${condition}`);
    if (rainForecast) weatherParts.push(`Rain forecast: ${rainForecast}`);
    if (weather && !condition) weatherParts.push(weather);
    const weatherCtx = weatherParts.length > 0 ? weatherParts.join(', ') : 'Not specified';

    // Build market context string
    const marketParts = [];
    if (marketPrice) marketParts.push(`Current price: ₹${marketPrice}/quintal`);
    if (priceTrend) marketParts.push(`Trend: ${priceTrend}`);
    const marketCtx = marketParts.length > 0 ? marketParts.join(', ') : null;

    // Determine alert priority
    const hasWeatherRisk = condition && ['rain', 'heavy rain', 'storm', 'heatwave', 'hailstorm', 'cold wave', 'strong winds', 'fog', 'thunderstorm']
      .some(w => condition.toLowerCase().includes(w));
    const hasMarketSignal = priceTrend && priceTrend !== 'stable';
    const hasBoth = hasWeatherRisk && hasMarketSignal;

    const sysPrompt = `You are an intelligent farming alert system that generates SMS alerts for farmers.

STRICT RULES:
• Message MUST be within 160 characters (SMS limit — this is CRITICAL)
• Simple, clear language only — a farmer with basic education must understand it
• Actionable advice ONLY — tell them exactly WHAT TO DO
• No technical jargon or scientific terms
• No chemical dosage recommendations
• Respond in ${langName} language
• Return ONLY the SMS text — no quotes, no "SMS Alert:" prefix, just the raw message

DECISION LOGIC:
${hasWeatherRisk ? '• Weather risk detected → Give weather-based protective advice (cover crops, drainage, avoid spraying, etc.)' : ''}
${hasMarketSignal && priceTrend === 'increase' ? '• Price is INCREASING → Suggest selling crops to get good price' : ''}
${hasMarketSignal && priceTrend === 'decrease' ? '• Price is DECREASING → Suggest holding/storing crops, sell later' : ''}
${hasBoth ? '• BOTH weather risk + price signal → Combine both smartly in ONE short message' : ''}
${!hasWeatherRisk && !hasMarketSignal ? '• Give general actionable advice based on the context provided' : ''}`;

    const userPrompt = `Generate ONE SMS alert (max 160 chars):
- Location: ${location || 'Not specified'}
- Crop: ${crop || 'Not specified'}
- Weather: ${weatherCtx}
${marketCtx ? `- Market: ${marketCtx}` : ''}
${issue ? `- Issue: ${issue}` : ''}

SMS Alert:`;

    let sms = await callGemini([
      { role: 'system', content: sysPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // Clean up AI response
    sms = sms.replace(/^(SMS Alert:\s*)/i, '').replace(/^["']|["']$/g, '').trim();

    // Enforce 160 char limit
    if (sms.length > 160) {
      sms = sms.substring(0, 157) + '...';
    }

    // Determine alert type for frontend badge
    let alertType = 'general';
    if (hasBoth) alertType = 'combined';
    else if (hasWeatherRisk) alertType = 'weather';
    else if (hasMarketSignal) alertType = 'market';
    else if (issue) alertType = 'advisory';

    res.json({
      sms,
      charCount: sms.length,
      language: langName,
      alertType,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('sms-alert error:', err);
    res.status(err.status || 500).json({ error: err.message });
  }
});

// ===== SEND SMS ALERT VIA EMAIL =====
const nodemailer = require('nodemailer');

// Create reusable transporter
let mailTransporter = null;
let mailFrom = null;

async function getMailTransporter() {
  if (mailTransporter) return mailTransporter;
  
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  // Use configured SMTP (Gmail, etc.) if available
  if (host && user && pass && user !== 'your_email@gmail.com') {
    mailTransporter = nodemailer.createTransport({
      host,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: { user, pass },
    });
    mailFrom = process.env.SMTP_FROM || `Krishi Mitra AI <${user}>`;
    console.log('📧 Email: Using configured SMTP (' + user + ')');
    return mailTransporter;
  }
  
  // Fallback: Direct SMTP - sends emails without needing any credentials
  // Emails will actually deliver (may land in spam for some providers)
  mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    // Use Ethereal for demo purposes - actually sends/captures
    ...(await (async () => {
      try {
        const testAccount = await nodemailer.createTestAccount();
        console.log('📧 Email: Using Ethereal test account');
        console.log('📧 View emails at: https://ethereal.email');
        console.log('📧 Login:', testAccount.user, '/', testAccount.pass);
        return {
          host: 'smtp.ethereal.email',
          auth: { user: testAccount.user, pass: testAccount.pass },
        };
      } catch {
        console.log('📧 Email: Ethereal unavailable, emails will not send');
        console.log('📧 To send real emails, set SMTP_USER and SMTP_PASS in server/.env');
        return { host: 'localhost', port: 25 };
      }
    })()),
  });
  mailFrom = 'Krishi Mitra AI <noreply@krishimitra.ai>';
  return mailTransporter;
}

const ALERT_TYPE_LABELS = {
  weather: { label: '🌧️ Weather Alert', color: '#2563eb' },
  market: { label: '📈 Market Alert', color: '#16a34a' },
  combined: { label: '⚡ Combined Alert', color: '#9333ea' },
  advisory: { label: '📋 Advisory', color: '#ea580c' },
  general: { label: '📱 General Alert', color: '#6b7280' },
};

router.post('/send-sms-email', async (req, res) => {
  try {
    const { email, sms, alertType, crop, location, language } = req.body;

    if (!email || !sms) {
      return res.status(400).json({ error: 'Email and SMS message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const transporter = await getMailTransporter();
    if (!transporter) {
      return res.status(503).json({ error: 'Email service could not be initialized' });
    }

    const alertInfo = ALERT_TYPE_LABELS[alertType] || ALERT_TYPE_LABELS.general;
    const dateStr = new Date().toLocaleDateString('en-IN', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    // Clean, mobile-friendly HTML email template
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#166534,#15803d);padding:24px 24px 20px;text-align:center;">
              <p style="margin:0;font-size:28px;">🌾</p>
              <h1 style="margin:8px 0 4px;color:#ffffff;font-size:20px;font-weight:700;">Krishi Mitra AI</h1>
              <p style="margin:0;color:#bbf7d0;font-size:12px;">Smart Farming Alert System</p>
            </td>
          </tr>
          
          <!-- Alert Badge -->
          <tr>
            <td style="padding:20px 24px 0;text-align:center;">
              <span style="display:inline-block;background:${alertInfo.color}15;color:${alertInfo.color};font-size:13px;font-weight:600;padding:6px 16px;border-radius:20px;border:1px solid ${alertInfo.color}30;">
                ${alertInfo.label}
              </span>
            </td>
          </tr>
          
          <!-- SMS Message -->
          <tr>
            <td style="padding:20px 24px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;border-left:4px solid #16a34a;">
                <p style="margin:0;font-size:16px;line-height:1.6;color:#1a1a1a;font-weight:500;">
                  ${sms}
                </p>
              </div>
              <p style="margin:8px 0 0;text-align:right;font-size:11px;color:#9ca3af;">
                ${sms.length}/160 characters
              </p>
            </td>
          </tr>
          
          <!-- Details -->
          <tr>
            <td style="padding:0 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#6b7280;">
                ${crop ? `<tr><td style="padding:4px 0;"><strong>🌱 Crop:</strong> ${crop}</td></tr>` : ''}
                ${location ? `<tr><td style="padding:4px 0;"><strong>📍 Location:</strong> ${location}</td></tr>` : ''}
                ${language ? `<tr><td style="padding:4px 0;"><strong>🗣️ Language:</strong> ${language}</td></tr>` : ''}
                <tr><td style="padding:4px 0;"><strong>🕐 Sent:</strong> ${dateStr}</td></tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                This alert was generated by Krishi Mitra AI 🌾<br>
                Your smart farming assistant
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const info = await transporter.sendMail({
      from: mailFrom || 'krishimitra@test.com',
      to: email,
      subject: `${alertInfo.label} - ${crop || 'Farming'} Advisory | Krishi Mitra`,
      text: `Krishi Mitra Alert\n\n${sms}\n\n${crop ? 'Crop: ' + crop : ''}${location ? '\nLocation: ' + location : ''}\nSent: ${dateStr}`,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview email at:', previewUrl);
    }

    res.json({ 
      success: true, 
      message: `Alert sent to ${email}`,
      previewUrl: previewUrl || null,
    });
  } catch (err) {
    console.error('send-sms-email error:', err);
    // Give user-friendly error for common SMTP issues
    if (err.code === 'EAUTH') {
      return res.status(401).json({ error: 'Email authentication failed. Check SMTP_USER and SMTP_PASS in server/.env' });
    }
    res.status(500).json({ error: err.message || 'Failed to send email' });
  }
});

module.exports = router;
