import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  
  // Quick Actions
  'quick.crop': { en: '🌾 Crop Advice', hi: '🌾 फसल सलाह', te: '🌾 పంట సలహా' },
  'quick.weather': { en: '🌤️ Weather', hi: '🌤️ मौसम', te: '🌤️ వాతావరణం' },
  'quick.pest': { en: '🐛 Pest Help', hi: '🐛 कीट सहायता', te: '🐛 చీడపీడల సహాయం' },
  'quick.market': { en: '📊 Market Prices', hi: '📊 बाजार मूल्य', te: '📊 మార్కెట్ ధరలు' },
  
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
  
  // Footer
  'footer.tagline': { 
    en: 'Empowering Indian farmers with AI', 
    hi: 'AI के साथ भारतीय किसानों को सशक्त बनाना',
    te: 'AI తో భారతీయ రైతులను సాధికారం చేయడం'
  },
  'footer.copyright': { 
    en: '© 2024 AI Farming Assistant. All rights reserved.', 
    hi: '© 2024 AI कृषि सहायक। सर्वाधिकार सुरक्षित।',
    te: '© 2024 AI వ్యవసాయ సహాయకుడు. అన్ని హక్కులు రిజర్వు చేయబడ్డాయి.'
  },
  
  // Common
  'language': { en: 'Language', hi: 'भाषा', te: 'భాష' },
  'english': { en: 'English', hi: 'अंग्रेज़ी', te: 'ఆంగ్లం' },
  'hindi': { en: 'हिंदी', hi: 'हिंदी', te: 'హిందీ' },
  'telugu': { en: 'తెలుగు', hi: 'तेलुगु', te: 'తెలుగు' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
