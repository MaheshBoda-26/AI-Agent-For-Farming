import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.chat': { en: 'Chat', hi: 'चैट' },
  'nav.weather': { en: 'Weather', hi: 'मौसम' },
  'nav.market': { en: 'Market', hi: 'मंडी' },
  
  // Hero Section
  'hero.title': { en: 'Your AI Farming Assistant', hi: 'आपका AI कृषि सहायक' },
  'hero.subtitle': { en: 'Get instant advice on crops, weather, pests, and market prices. Simple guidance for better farming.', hi: 'फसलों, मौसम, कीटों और बाजार मूल्यों पर तत्काल सलाह प्राप्त करें। बेहतर खेती के लिए सरल मार्गदर्शन।' },
  'hero.cta': { en: 'Start Chatting', hi: 'चैट शुरू करें' },
  'hero.cta.secondary': { en: 'Learn More', hi: 'और जानें' },
  
  // Features
  'features.title': { en: 'How We Help You', hi: 'हम आपकी कैसे मदद करते हैं' },
  'features.crop.title': { en: 'Crop Advisory', hi: 'फसल सलाह' },
  'features.crop.desc': { en: 'Get personalized recommendations for sowing, watering, and harvesting based on your location and soil.', hi: 'अपने स्थान और मिट्टी के आधार पर बुवाई, सिंचाई और कटाई के लिए व्यक्तिगत सिफारिशें प्राप्त करें।' },
  'features.weather.title': { en: 'Weather Alerts', hi: 'मौसम अलर्ट' },
  'features.weather.desc': { en: '7-day forecasts and rain alerts to help you plan your farming activities.', hi: 'अपनी खेती गतिविधियों की योजना बनाने में मदद के लिए 7-दिन का पूर्वानुमान और बारिश अलर्ट।' },
  'features.pest.title': { en: 'Pest Control', hi: 'कीट नियंत्रण' },
  'features.pest.desc': { en: 'Identify pests and get treatment recommendations approved by agricultural experts.', hi: 'कीटों की पहचान करें और कृषि विशेषज्ञों द्वारा अनुमोदित उपचार सिफारिशें प्राप्त करें।' },
  'features.market.title': { en: 'Market Prices', hi: 'बाजार मूल्य' },
  'features.market.desc': { en: 'Check real-time mandi prices and find the best time to sell your crops.', hi: 'वास्तविक समय में मंडी की कीमतों की जांच करें और अपनी फसल बेचने का सबसे अच्छा समय खोजें।' },
  
  // Chat
  'chat.placeholder': { en: 'Ask about crops, weather, pests, or prices...', hi: 'फसलों, मौसम, कीटों या कीमतों के बारे में पूछें...' },
  'chat.send': { en: 'Send', hi: 'भेजें' },
  'chat.welcome': { en: 'Hello! I am your farming assistant. How can I help you today?', hi: 'नमस्ते! मैं आपका कृषि सहायक हूं। आज मैं आपकी कैसे मदद कर सकता हूं?' },
  'chat.thinking': { en: 'Thinking...', hi: 'सोच रहा हूं...' },
  
  // Quick Actions
  'quick.crop': { en: '🌾 Crop Advice', hi: '🌾 फसल सलाह' },
  'quick.weather': { en: '🌤️ Weather', hi: '🌤️ मौसम' },
  'quick.pest': { en: '🐛 Pest Help', hi: '🐛 कीट सहायता' },
  'quick.market': { en: '📊 Market Prices', hi: '📊 बाजार मूल्य' },
  
  // Location
  'location.title': { en: 'Select Your Location', hi: 'अपना स्थान चुनें' },
  'location.state': { en: 'State', hi: 'राज्य' },
  'location.district': { en: 'District', hi: 'जिला' },
  
  // Weather Card
  'weather.today': { en: 'Today', hi: 'आज' },
  'weather.forecast': { en: '7-Day Forecast', hi: '7-दिन का पूर्वानुमान' },
  'weather.rain': { en: 'Rain Expected', hi: 'बारिश की संभावना' },
  'weather.sunny': { en: 'Sunny', hi: 'धूप' },
  'weather.cloudy': { en: 'Cloudy', hi: 'बादल' },
  
  // Footer
  'footer.tagline': { en: 'Empowering Indian farmers with AI', hi: 'AI के साथ भारतीय किसानों को सशक्त बनाना' },
  'footer.copyright': { en: '© 2024 AI Farming Assistant. All rights reserved.', hi: '© 2024 AI कृषि सहायक। सर्वाधिकार सुरक्षित।' },
  
  // Common
  'language': { en: 'Language', hi: 'भाषा' },
  'english': { en: 'English', hi: 'अंग्रेज़ी' },
  'hindi': { en: 'हिंदी', hi: 'हिंदी' },
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
