import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
    te: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम', te: 'హోమ్' },
  'nav.chat': { en: 'Chat', hi: 'चैट', te: 'చాట్' },
  'nav.crops': { en: 'Crops', hi: 'फसल', te: 'పంటలు' },
  'nav.pest': { en: 'Pest', hi: 'कीट', te: 'పురుగు' },
  'nav.disease': { en: 'Disease', hi: 'रोग', te: 'వ్యాధి' },
  'nav.weather': { en: 'Weather', hi: 'मौसम', te: 'వాతావరణం' },
  'nav.market': { en: 'Market', hi: 'मंडी', te: 'మార్కెట్' },
  
  // Hero Section
  'hero.title': { en: 'Your AI Farming Assistant', hi: 'आपका AI कृषि सहायक', te: 'మీ AI వ్యవసాయ సహాయకుడు' },
  'hero.subtitle': { 
    en: 'Get instant advice on crops, weather, pests, and market prices. Simple guidance for better farming.', 
    hi: 'फसलों, मौसम, कीटों और बाजार मूल्यों पर तत्काल सलाह प्राप्त करें। बेहतर खेती के लिए सरल मार्गदर्शन।',
    te: 'పంటలు, వాతావరణం, చీడపీడలు మరియు మార్కెట్ ధరలపై తక్షణ సలహా పొందండి. మెరుగైన వ్యవసాయం కోసం సరళ మార్గదర్శకత్వం.'
  },
  'hero.cta': { en: 'Start Chatting', hi: 'चैट शुरू करें', te: 'చాట్ ప్రారంభించండి' },
  'hero.cta.secondary': { en: 'Learn More', hi: 'और जानें', te: 'మరింత తెలుసుకోండి' },
  
  // Features
  'features.title': { en: 'How We Help You', hi: 'हम आपकी कैसे मदद करते हैं', te: 'మేము మీకు ఎలా సహాయం చేస్తాము' },
  'features.subtitle': { 
    en: 'Simple tools designed for Indian farmers. Get advice in your language.',
    hi: 'भारतीय किसानों के लिए डिज़ाइन किए गए सरल उपकरण। अपनी भाषा में सलाह प्राप्त करें।',
    te: 'భారతీయ రైతుల కోసం రూపొందించిన సరళ సాధనాలు. మీ భాషలో సలహా పొందండి.'
  },
  'features.crop.title': { en: 'Crop Advisory', hi: 'फसल सलाह', te: 'పంట సలహా' },
  'features.crop.desc': { 
    en: 'Get personalized recommendations for sowing, watering, and harvesting based on your location and soil.', 
    hi: 'अपने स्थान और मिट्टी के आधार पर बुवाई, सिंचाई और कटाई के लिए व्यक्तिगत सिफारिशें प्राप्त करें।',
    te: 'మీ స్థానం మరియు నేల ఆధారంగా విత్తనం, నీరు పెట్టడం మరియు కోత కోసం వ్యక్తిగత సిఫార్సులు పొందండి.'
  },
  'features.weather.title': { en: 'Weather Alerts', hi: 'मौसम अलर्ट', te: 'వాతావరణ హెచ్చరికలు' },
  'features.weather.desc': { 
    en: '7-day forecasts and rain alerts to help you plan your farming activities.', 
    hi: 'अपनी खेती गतिविधियों की योजना बनाने में मदद के लिए 7-दिन का पूर्वानुमान और बारिश अलर्ट।',
    te: 'మీ వ్యవసాయ కార్యకలాపాలను ప్లాన్ చేయడానికి 7-రోజుల అంచనాలు మరియు వర్షం హెచ్చరికలు.'
  },
  'features.pest.title': { en: 'Pest Control', hi: 'कीट नियंत्रण', te: 'చీడపీడల నియంత్రణ' },
  'features.pest.desc': { 
    en: 'Identify pests and get treatment recommendations approved by agricultural experts.', 
    hi: 'कीटों की पहचान करें और कृषि विशेषज्ञों द्वारा अनुमोदित उपचार सिफारिशें प्राप्त करें।',
    te: 'చీడపీడలను గుర్తించండి మరియు వ్యవసాయ నిపుణులు ఆమోదించిన చికిత్స సిఫార్సులు పొందండి.'
  },
  'features.market.title': { en: 'Market Prices', hi: 'बाजार मूल्य', te: 'మార్కెట్ ధరలు' },
  'features.market.desc': { 
    en: 'Check real-time mandi prices and find the best time to sell your crops.', 
    hi: 'वास्तविक समय में मंडी की कीमतों की जांच करें और अपनी फसल बेचने का सबसे अच्छा समय खोजें।',
    te: 'రియల్-టైమ్ మండీ ధరలను తనిఖీ చేయండి మరియు మీ పంటలను విక్రయించడానికి ఉత్తమ సమయాన్ని కనుగొనండి.'
  },
  
  // Chat
  'chat.placeholder': { 
    en: 'Ask about crops, weather, pests, or prices...', 
    hi: 'फसलों, मौसम, कीटों या कीमतों के बारे में पूछें...', 
    te: 'పంటలు, వాతావరణం, చీడపీడలు లేదా ధరల గురించి అడగండి...' 
  },
  'chat.send': { en: 'Send', hi: 'भेजें', te: 'పంపండి' },
  'chat.welcome': { 
    en: 'Hello! I am your farming assistant. How can I help you today?', 
    hi: 'नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    te: 'నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?'
  },
  'chat.thinking': { en: 'Thinking...', hi: 'सोच रहा हूं...', te: 'ఆలోచిస్తున్నాను...' },
  'chat.clear': { en: 'Clear', hi: 'साफ़ करें', te: 'క్లియర్ చేయండి' },
  
  // Quick Actions
  'quick.crop': { en: '🌾 Crop Advice', hi: '🌾 फसल सलाह', te: '🌾 పంట సలహా' },
  'quick.weather': { en: '🌤️ Weather', hi: '🌤️ मौसम', te: '🌤️ వాతావరణం' },
  'quick.pest': { en: '🐛 Pest Help', hi: '🐛 कीट सहायता', te: '🐛 చీడపీడల సహాయం' },
  'quick.market': { en: '📊 Market Prices', hi: '📊 बाजार मूल्य', te: '📊 మార్కెట్ ధరలు' },
  
  // Quick Action Queries
  'quick.crop.query': { 
    en: 'What crops should I grow this season?', 
    hi: 'इस मौसम में मुझे कौन सी फसल उगानी चाहिए?',
    te: 'ఈ సీజన్‌లో నేను ఏ పంటలు పండించాలి?'
  },
  'quick.weather.query': { 
    en: 'What is the weather forecast for my area?', 
    hi: 'मेरे क्षेत्र के लिए मौसम का पूर्वानुमान क्या है?',
    te: 'నా ప్రాంతానికి వాతావరణ సూచన ఏమిటి?'
  },
  'quick.pest.query': { 
    en: 'How do I control pests in my crops?', 
    hi: 'मैं अपनी फसलों में कीटों को कैसे नियंत्रित करूं?',
    te: 'నా పంటలలో చీడపీడలను ఎలా నియంత్రించాలి?'
  },
  'quick.market.query': { 
    en: 'What are the current market prices for rice?', 
    hi: 'चावल की वर्तमान बाजार कीमतें क्या हैं?',
    te: 'బియ్యానికి ప్రస్తుత మార్కెట్ ధరలు ఎంత?'
  },
  
  // Location
  'location.title': { en: 'Select Your Location', hi: 'अपना स्थान चुनें', te: 'మీ స్థానాన్ని ఎంచుకోండి' },
  'location.state': { en: 'State', hi: 'राज्य', te: 'రాష్ట్రం' },
  'location.district': { en: 'District', hi: 'जिला', te: 'జిల్లా' },
  
  // Weather Card
  'weather.today': { en: 'Today', hi: 'आज', te: 'ఈ రోజు' },
  'weather.forecast': { en: '7-Day Forecast', hi: '7-दिन का पूर्वानुमान', te: '7-రోజుల అంచనా' },
  'weather.rain': { en: 'Rain Expected', hi: 'बारिश की संभावना', te: 'వర్షం అంచనా' },
  'weather.sunny': { en: 'Sunny', hi: 'धूप', te: 'ఎండ' },
  'weather.cloudy': { en: 'Cloudy', hi: 'बादल', te: 'మేఘావృతం' },
  
  // Index Page
  'index.steps.title': { en: 'Simple Steps to Better Farming', hi: 'बेहतर खेती के लिए सरल कदम', te: 'మెరుగైన వ్యవసాయం కోసం సరళ దశలు' },
  'index.step1.title': { en: 'Open Chat', hi: 'चैट खोलें', te: 'చాట్ తెరవండి' },
  'index.step1.desc': { en: 'Start a conversation in your language', hi: 'अपनी भाषा में बातचीत शुरू करें', te: 'మీ భాషలో సంభాషణ ప్రారంభించండి' },
  'index.step2.title': { en: 'Ask Question', hi: 'सवाल पूछें', te: 'ప్రశ్న అడగండి' },
  'index.step2.desc': { en: 'Type or speak about crops, weather, or pests', hi: 'फसलों, मौसम या कीटों के बारे में टाइप करें या बोलें', te: 'పంటలు, వాతావరణం లేదా చీడపీడల గురించి టైప్ చేయండి లేదా మాట్లాడండి' },
  'index.step3.title': { en: 'Get Advice', hi: 'सलाह प्राप्त करें', te: 'సలహా పొందండి' },
  'index.step3.desc': { en: 'Receive actionable steps with timelines', hi: 'समयसीमा के साथ कार्रवाई योग्य कदम प्राप्त करें', te: 'టైమ్‌లైన్‌లతో చర్య తీసుకోదగిన దశలను పొందండి' },
  
  // Benefits
  'benefit.free': { en: 'Free to use for all farmers', hi: 'सभी किसानों के लिए मुफ्त', te: 'అన్ని రైతులకు ఉచితం' },
  'benefit.languages': { en: 'Works in Hindi, Telugu and English', hi: 'हिंदी, तेलुगु और अंग्रेजी में काम करता है', te: 'హిందీ, తెలుగు మరియు ఆంగ్లంలో పని చేస్తుంది' },
  'benefit.availability': { en: 'Available 24/7 on any device', hi: 'किसी भी डिवाइस पर 24/7 उपलब्ध', te: 'ఏ పరికరంలోనైనా 24/7 అందుబాటులో' },
  'benefit.noregistration': { en: 'No registration required', hi: 'पंजीकरण की आवश्यकता नहीं', te: 'నమోదు అవసరం లేదు' },
  
  // Today's Tip
  'tip.title': { en: "Today's Tip", hi: 'आज की टिप', te: 'ఈ రోజు చిట్కా' },
  'tip.content': { 
    en: '🌾 Best time to water your wheat crop is early morning (6-8 AM) to reduce evaporation and prevent fungal diseases.',
    hi: '🌾 अपनी गेहूं की फसल को पानी देने का सबसे अच्छा समय सुबह जल्दी (6-8 बजे) है ताकि वाष्पीकरण कम हो और फफूंद रोगों से बचा जा सके।',
    te: '🌾 మీ గోధుమ పంటకు నీరు పెట్టడానికి ఉత్తమ సమయం ఉదయం (6-8 AM) బాష్పీభవనం తగ్గించడానికి మరియు ఫంగల్ వ్యాధులను నివారించడానికి.'
  },
  'tip.more': { en: 'Get More Tips', hi: 'और टिप्स प्राप्त करें', te: 'మరిన్ని చిట్కాలు పొందండి' },
  
  // CTA Section
  'cta.title': { en: 'Ready to Improve Your Farming?', hi: 'अपनी खेती में सुधार के लिए तैयार?', te: 'మీ వ్యవసాయాన్ని మెరుగుపరచడానికి సిద్ధంగా ఉన్నారా?' },
  'cta.subtitle': { 
    en: 'Join thousands of Indian farmers getting AI-powered advice for better crop management.',
    hi: 'बेहतर फसल प्रबंधन के लिए AI-संचालित सलाह प्राप्त करने वाले हजारों भारतीय किसानों से जुड़ें।',
    te: 'మెరుగైన పంట నిర్వహణ కోసం AI-ఆధారిత సలహా పొందుతున్న వేలాది భారతీయ రైతులతో చేరండి.'
  },
  
  // Chat Page
  'chat.tips.title': { en: 'Quick Tips', hi: 'त्वरित सुझाव', te: 'త్వరిత చిట్కాలు' },
  'chat.tips.1': { en: 'Ask about specific crops for better advice', hi: 'बेहतर सलाह के लिए विशिष्ट फसलों के बारे में पूछें', te: 'మెరుగైన సలహా కోసం నిర్దిష్ట పంటల గురించి అడగండి' },
  'chat.tips.2': { en: 'Include your location for local weather', hi: 'स्थानीय मौसम के लिए अपना स्थान शामिल करें', te: 'స్థానిక వాతావరణం కోసం మీ స్థానాన్ని చేర్చండి' },
  'chat.tips.3': { en: 'Describe pest symptoms in detail', hi: 'कीट लक्षणों का विस्तार से वर्णन करें', te: 'చీడపీడల లక్షణాలను వివరంగా వివరించండి' },
  'chat.tips.4': { en: 'Chat in Hindi, Telugu or English', hi: 'हिंदी, तेलुगु या अंग्रेजी में चैट करें', te: 'హిందీ, తెలుగు లేదా ఆంగ్లంలో చాట్ చేయండి' },
  
  'chat.popular.title': { en: 'Popular Questions', hi: 'लोकप्रिय सवाल', te: 'జనప్రియ ప్రశ్నలు' },
  'chat.popular.1': { en: 'When should I sow wheat?', hi: 'मुझे गेहूं कब बोना चाहिए?', te: 'నేను గోధుమలు ఎప్పుడు విత్తాలి?' },
  'chat.popular.2': { en: 'How to control aphids in cotton?', hi: 'कपास में एफिड्स को कैसे नियंत्रित करें?', te: 'పత్తిలో ఆఫిడ్‌లను ఎలా నియంత్రించాలి?' },
  'chat.popular.3': { en: 'Best fertilizer for rice?', hi: 'धान के लिए सबसे अच्छा उर्वरक?', te: 'వరికి ఉత్తమ ఎరువు?' },
  'chat.popular.4': { en: 'PM-KISAN eligibility?', hi: 'PM-KISAN पात्रता?', te: 'PM-KISAN అర్హత?' },
  
  // Footer
  'footer.tagline': { 
    en: 'Empowering Indian farmers with AI', 
    hi: 'AI के साथ भारतीय किसानों को सशक्त बनाना',
    te: 'AI తో భారతీయ రైతులను సాధికారం చేయడం'
  },
  'footer.copyright': { 
    en: '© 2024 Kisan Mitra AI. All rights reserved.', 
    hi: '© 2024 किसान मित्र AI। सर्वाधिकार सुरक्षित।',
    te: '© 2024 కిసాన్ మిత్ర AI. అన్ని హక్కులు రిజర్వు చేయబడ్డాయి.'
  },
  
  // Voice Input
  'voice.start': { en: 'Speak your question', hi: 'अपना सवाल बोलें', te: 'మీ ప్రశ్న చెప్పండి' },
  'voice.stop': { en: 'Stop recording', hi: 'रिकॉर्डिंग बंद करें', te: 'రికార్డింగ్ ఆపండి' },
  'voice.listening': { en: 'Listening...', hi: 'सुन रहा हूं...', te: 'వింటున్నాను...' },
  
  // Crop Suggestion
  'crop.suggest.title': { en: 'Crop Suggestion Engine', hi: 'फसल सुझाव इंजन', te: 'పంట సూచన ఇంజన్' },
  'crop.suggest.state': { en: 'State', hi: 'राज्य', te: 'రాష్ట్రం' },
  'crop.suggest.soil': { en: 'Soil Type', hi: 'मिट्टी का प्रकार', te: 'నేల రకం' },
  'crop.suggest.season': { en: 'Season', hi: 'मौसम', te: 'సీజన్' },
  'crop.suggest.button': { en: 'Get Crop Suggestions', hi: 'फसल सुझाव प्राप्त करें', te: 'పంట సూచనలు పొందండి' },
  'crop.suggest.analyzing': { en: 'Analyzing...', hi: 'विश्लेषण हो रहा है...', te: 'విశ్లేషిస్తోంది...' },
  'crop.suggest.results': { en: 'Recommended Crops', hi: 'सुझाई गई फसलें', te: 'సిఫార్సు చేసిన పంటలు' },
  'crop.suggest.suitable': { en: 'suitable', hi: 'उपयुक्त', te: 'అనుకూలం' },
  'crop.suggest.ask': { en: 'Ask AI about these crops', hi: 'इन फसलों के बारे में AI से पूछें', te: 'ఈ పంటల గురించి AI ని అడగండి' },
  'crop.suggest.selectState': { en: 'Select state', hi: 'राज्य चुनें', te: 'రాష్ట్రం ఎంచుకోండి' },
  'crop.suggest.selectSoil': { en: 'Select soil', hi: 'मिट्टी चुनें', te: 'నేల ఎంచుకోండి' },
  'crop.suggest.currentTemp': { en: 'Current', hi: 'वर्तमान तापमान', te: 'ప్రస్తుత' },
  
  // Pest Advisory
  'pest.title': { en: 'Pest & Disease Advisory', hi: 'कीट एवं रोग सलाह', te: 'పురుగు & వ్యాధి సలహా' },
  'pest.description': { en: 'Identify pests and get treatment recommendations', hi: 'कीटों की पहचान करें और उपचार की सिफारिशें प्राप्त करें', te: 'పురుగులను గుర్తించి చికిత్స సూచనలు పొందండి' },
  'pest.crop': { en: 'Select Crop', hi: 'फसल चुनें', te: 'పంట ఎంచుకోండి' },
  'pest.customCrop': { en: 'Or enter crop name', hi: 'या फसल का नाम लिखें', te: 'లేదా పంట పేరు నమోదు చేయండి' },
  'pest.stage': { en: 'Growth Stage', hi: 'विकास अवस्था', te: 'పెరుగుదల దశ' },
  'pest.symptoms': { en: 'Describe Symptoms', hi: 'लक्षण बताएं', te: 'లక్షణాలను వివరించండి' },
  'pest.symptomsPlaceholder': { en: 'Describe what you see: yellowing leaves, holes, wilting, insects, etc.', hi: 'आप क्या देख रहे हैं बताएं: पत्तियों का पीलापन, छेद, मुरझाना, कीड़े आदि', te: 'మీరు చూస్తున్నది వివరించండి: ఆకులు పసుపు, రంధ్రాలు, వాడిపోవడం, పురుగులు మొదలైనవి' },
  'pest.image': { en: 'Add Photo (Optional)', hi: 'फोटो जोड़ें (वैकल्पिक)', te: 'ఫోటో జోడించండి (ఐచ్ఛికం)' },
  'pest.submit': { en: 'Get Advisory', hi: 'सलाह प्राप्त करें', te: 'సలహా పొందండి' },
  'pest.analyzing': { en: 'Analyzing...', hi: 'विश्लेषण हो रहा है...', te: 'విశ్లేషిస్తోంది...' },
  'pest.reset': { en: 'New Analysis', hi: 'नया विश्लेषण', te: 'కొత్త విశ్లేషణ' },
  'pest.confidence': { en: 'Confidence', hi: 'विश्वास स्तर', te: 'నమ్మకం' },
  'pest.riskLevel': { en: 'Risk Level', hi: 'जोखिम स्तर', te: 'ప్రమాద స్థాయి' },
  'pest.reasons': { en: 'Why This Pest', hi: 'यह कीट क्यों', te: 'ఈ పురుగు ఎందుకు' },
  'pest.actions': { en: 'Organic & Mechanical Controls', hi: 'जैविक एवं यांत्रिक नियंत्रण', te: 'సేంద్రీయ & యాంత్రిక నియంత్రణలు' },
  'pest.chemicalOptions': { en: 'Chemical Options', hi: 'रासायनिक विकल्प', te: 'రసాయన ఎంపికలు' },
  'pest.chemicalDisclaimer': { en: '⚠️ Consult local agriculture officer for dosage', hi: '⚠️ खुराक के लिए स्थानीय कृषि अधिकारी से सलाह लें', te: '⚠️ మోతాదు కోసం స్థానిక వ్యవసాయ అధికారిని సంప్రదించండి' },
  'pest.prevention': { en: 'Prevention', hi: 'रोकथाम', te: 'నివారణ' },
  'pest.riskNote': { en: 'Risk Warning', hi: 'जोखिम चेतावनी', te: 'ప్రమాద హెచ్చరిక' },
  'pest.followUp': { en: 'When to Seek Help', hi: 'विशेषज्ञ से कब मिलें', te: 'నిపుణుని ఎప్పుడు కలవాలి' },
  'pest.otherPossible': { en: 'Other Possible Pests', hi: 'अन्य संभावित कीट', te: 'ఇతర సాధ్యమైన పురుగులు' },
  'pest.noPestFound': { en: 'No Pest Identified', hi: 'कोई कीट नहीं पहचाना गया', te: 'పురుగు గుర్తించబడలేదు' },
  'pest.discussWithAI': { en: 'Discuss with AI', hi: 'AI से चर्चा करें', te: 'AI తో చర్చించండి' },
  
  // Disease Identification / Crop Image Analysis
  'disease.title': { en: 'Crop Disease/Pest Identification', hi: 'फसल रोग/कीट पहचान', te: 'పంట వ్యాధి/పురుగు గుర్తింపు' },
  'disease.takeUpload': { en: 'Take or Upload Crop Photo', hi: 'फसल की फोटो लें या अपलोड करें', te: 'పంట ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి' },
  'disease.clearPhoto': { en: 'Take a clear photo of affected leaves, stems, or fruits', hi: 'रोगग्रस्त पत्तियों, तने या फल की स्पष्ट फोटो लें', te: 'ప్రభావిత ఆకులు, కాండాలు లేదా పండ్ల స్పష్టమైన ఫోటో తీయండి' },
  'disease.uploading': { en: 'Uploading...', hi: 'अपलोड हो रहा है...', te: 'అప్‌లోడ్ అవుతోంది...' },
  'disease.additionalInfo': { en: 'Additional Information (Optional)', hi: 'अतिरिक्त जानकारी (वैकल्पिक)', te: 'అదనపు సమాచారం (ఐచ్ఛికం)' },
  'disease.additionalPlaceholder': { en: 'Crop name, when symptoms appeared, etc...', hi: 'फसल का नाम, लक्षण कब दिखे, आदि...', te: 'పంట పేరు, లక్షణాలు ఎప్పుడు కనిపించాయి, మొదలైనవి...' },
  'disease.analyzing': { en: 'Analyzing...', hi: 'विश्लेषण हो रहा है...', te: 'విశ్లేషిస్తోంది...' },
  'disease.analyze': { en: 'Analyze Image', hi: 'छवि का विश्लेषण करें', te: 'చిత్రాన్ని విశ్లేషించండి' },
  'disease.newImage': { en: 'New Image', hi: 'नई छवि', te: 'కొత్త చిత్రం' },
  'disease.askMore': { en: 'Ask AI More', hi: 'AI से और पूछें', te: 'AI ని మరింత అడగండి' },
  'disease.tips': { en: 'Tips for Good Photos', hi: 'अच्छी फोटो के लिए सुझाव', te: 'మంచి ఫోటోల కోసం చిట్కాలు' },
  'disease.tip1': { en: 'Take close-up of affected parts', hi: 'प्रभावित भाग को करीब से लें', te: 'ప్రభావిత భాగాల క్లోజ్-అప్ తీయండి' },
  'disease.tip2': { en: 'Use good lighting', hi: 'अच्छी रोशनी में फोटो लें', te: 'మంచి లైటింగ్ ఉపయోగించండి' },
  'disease.tip3': { en: 'Capture both sides of leaves', hi: 'पत्ती के दोनों तरफ की फोटो लें', te: 'ఆకుల రెండు వైపులా తీయండి' },
  'disease.tip4': { en: 'Include multiple affected plants', hi: 'कई प्रभावित पौधों की फोटो लें', te: 'అనేక ప్రభావిత మొక్కలను చేర్చండి' },
  'disease.imageOnly': { en: 'Please upload only image files', hi: 'कृपया केवल छवि फ़ाइलें अपलोड करें', te: 'దయచేసి చిత్ర ఫైళ్లను మాత్రమే అప్‌లోడ్ చేయండి' },
  'disease.fileSizeError': { en: 'File size must be less than 10MB', hi: 'फ़ाइल का आकार 10MB से कम होना चाहिए', te: 'ఫైల్ పరిమాణం 10MB కంటే తక్కువగా ఉండాలి' },
  'disease.uploadFailed': { en: 'Failed to upload image', hi: 'छवि अपलोड करने में विफल', te: 'చిత్రాన్ని అప్‌లోడ్ చేయడం విఫలమైంది' },
  'disease.analysisComplete': { en: 'Crop analysis complete', hi: 'फसल विश्लेषण पूर्ण', te: 'పంట విశ్లేషణ పూర్తయింది' },
  
  // Common
  'common.retry': { en: 'Retry', hi: 'पुनः प्रयास करें', te: 'మళ్లీ ప్రయత్నించండి' },
  'language': { en: 'Language', hi: 'भाषा', te: 'భాష' },
  'english': { en: 'English', hi: 'अंग्रेज़ी', te: 'ఆంగ్లం' },
  'hindi': { en: 'हिंदी', hi: 'हिंदी', te: 'హిందీ' },
  'telugu': { en: 'తెలుగు', hi: 'तेलुगु', te: 'తెలుగు' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  hasSelectedLanguage: boolean;
  setHasSelectedLanguage: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'preferred-language';
const LANGUAGE_SELECTED_KEY = 'language-selected';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (stored as Language) || 'en';
  });
  
  const [hasSelectedLanguage, setHasSelectedLanguageState] = useState<boolean>(() => {
    return localStorage.getItem(LANGUAGE_SELECTED_KEY) === 'true';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const setHasSelectedLanguage = (value: boolean) => {
    setHasSelectedLanguageState(value);
    localStorage.setItem(LANGUAGE_SELECTED_KEY, String(value));
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, hasSelectedLanguage, setHasSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
