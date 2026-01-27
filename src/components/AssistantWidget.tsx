import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  actions?: { label: string; path: string }[];
}

const QUICK_REPLIES = [
  { id: 'market', label: { en: '📊 Market Prices', hi: '📊 बाजार भाव', te: '📊 మార్కెట్ ధరలు' } },
  { id: 'weather', label: { en: '🌤️ Weather', hi: '🌤️ मौसम', te: '🌤️ వాతావరణం' } },
  { id: 'chat', label: { en: '🌾 Crop Advice', hi: '🌾 फसल सलाह', te: '🌾 పంట సలహా' } },
  { id: 'disease', label: { en: '🔬 Disease ID', hi: '🔬 रोग पहचान', te: '🔬 వ్యాధి గుర్తింపు' } },
];

export const AssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const getWelcomeMessage = (): Message => ({
    role: 'assistant',
    content: language === 'hi' 
      ? 'नमस्ते! 🙏 मैं आपका किसान सहायक हूं। मैं आपकी कैसे मदद कर सकता हूं?'
      : language === 'te'
      ? 'నమస్కారం! 🙏 నేను మీ రైతు సహాయకుడిని. నేను మీకు ఎలా సహాయం చేయగలను?'
      : 'Hello! 🙏 I\'m your Kisan Assistant. How can I help you today?',
  });

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([getWelcomeMessage()]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const processQuery = (query: string): Message => {
    const lowerQuery = query.toLowerCase();
    
    // Market prices
    if (lowerQuery.includes('market') || lowerQuery.includes('price') || lowerQuery.includes('mandi') || 
        lowerQuery.includes('बाजार') || lowerQuery.includes('भाव') || lowerQuery.includes('మార్కెట్')) {
      return {
        role: 'assistant',
        content: language === 'hi'
          ? '📊 आप मंडी बाजार भाव पृष्ठ पर सभी 28 राज्यों के लाइव फसल मूल्य देख सकते हैं। वहां आप फसल और राज्य के अनुसार फ़िल्टर कर सकते हैं।'
          : language === 'te'
          ? '📊 మీరు మార్కెట్ ధరల పేజీలో అన్ని 28 రాష్ట్రాల లైవ్ పంట ధరలను చూడవచ్చు. అక్కడ మీరు పంట మరియు రాష్ట్రం ద్వారా ఫిల్టర్ చేయవచ్చు.'
          : '📊 You can check live crop prices for all 28 states on the Market Prices page. There you can filter by crop and state.',
        actions: [{ label: language === 'hi' ? 'बाजार भाव देखें' : 'View Market Prices', path: '/market' }],
      };
    }
    
    // Weather
    if (lowerQuery.includes('weather') || lowerQuery.includes('rain') || lowerQuery.includes('forecast') ||
        lowerQuery.includes('मौसम') || lowerQuery.includes('बारिश') || lowerQuery.includes('వాతావరణం')) {
      return {
        role: 'assistant',
        content: language === 'hi'
          ? '🌤️ मौसम की जानकारी AI चैट पृष्ठ के साइडबार में उपलब्ध है। यह आपके स्थान के आधार पर 5-दिन का पूर्वानुमान दिखाता है।'
          : language === 'te'
          ? '🌤️ వాతావరణ సమాచారం AI చాట్ పేజీ సైడ్‌బార్‌లో అందుబాటులో ఉంది. ఇది మీ స్థానం ఆధారంగా 5-రోజుల అంచనాను చూపిస్తుంది.'
          : '🌤️ Weather information is available on the AI Chat page sidebar. It shows a 5-day forecast based on your location.',
        actions: [{ label: language === 'hi' ? 'मौसम देखें' : 'Check Weather', path: '/chat' }],
      };
    }
    
    // Crop advice / Chat
    if (lowerQuery.includes('crop') || lowerQuery.includes('advice') || lowerQuery.includes('suggest') || lowerQuery.includes('farming') ||
        lowerQuery.includes('फसल') || lowerQuery.includes('सलाह') || lowerQuery.includes('పంట')) {
      return {
        role: 'assistant',
        content: language === 'hi'
          ? '🌾 AI किसान सहायक से खेती संबंधी सलाह प्राप्त करें। आप फसल सुझाव फॉर्म भी भर सकते हैं जो आपकी मिट्टी और मौसम के अनुसार सर्वोत्तम फसल सुझाएगा।'
          : language === 'te'
          ? '🌾 AI రైతు సహాయకుడి నుండి వ్యవసాయ సలహా పొందండి. మీ నేల మరియు సీజన్ ఆధారంగా ఉత్తమ పంటను సూచించే పంట సూచన ఫారమ్‌ను కూడా పూరించవచ్చు.'
          : '🌾 Get farming advice from our AI Assistant. You can also fill the Crop Suggestion form which recommends the best crops based on your soil and season.',
        actions: [{ label: language === 'hi' ? 'AI से बात करें' : 'Talk to AI', path: '/chat' }],
      };
    }
    
    // Disease identification
    if (lowerQuery.includes('disease') || lowerQuery.includes('pest') || lowerQuery.includes('photo') || lowerQuery.includes('image') ||
        lowerQuery.includes('रोग') || lowerQuery.includes('कीट') || lowerQuery.includes('వ్యాధి')) {
      return {
        role: 'assistant',
        content: language === 'hi'
          ? '🔬 रोग पहचान टैब पर अपनी फसल की फोटो अपलोड करें। AI आपकी फसल में रोग या कीट की पहचान करेगा और उपचार सुझाएगा।'
          : language === 'te'
          ? '🔬 వ్యాధి గుర్తింపు ట్యాబ్‌లో మీ పంట ఫోటోను అప్‌లోడ్ చేయండి. AI మీ పంటలో వ్యాధి లేదా తెగులును గుర్తించి చికిత్సను సూచిస్తుంది.'
          : '🔬 Upload a photo of your crop on the Disease ID tab. The AI will identify any disease or pest and suggest treatment options.',
        actions: [{ label: language === 'hi' ? 'रोग पहचानें' : 'Identify Disease', path: '/chat' }],
      };
    }
    
    // Features / Help
    if (lowerQuery.includes('feature') || lowerQuery.includes('help') || lowerQuery.includes('what can') || lowerQuery.includes('how to') ||
        lowerQuery.includes('मदद') || lowerQuery.includes('सहायता') || lowerQuery.includes('సహాయం')) {
      return {
        role: 'assistant',
        content: language === 'hi'
          ? '🚀 किसान मित्र AI में ये सुविधाएं हैं:\n\n• 🌾 AI फसल सलाहकार\n• 📊 28 राज्यों के मंडी भाव\n• 🌤️ स्थानीय मौसम पूर्वानुमान\n• 🔬 फोटो से रोग पहचान\n• 🗣️ हिंदी व अंग्रेजी में वॉइस इनपुट'
          : language === 'te'
          ? '🚀 కిసాన్ మిత్ర AIలో ఈ ఫీచర్లు ఉన్నాయి:\n\n• 🌾 AI పంట సలహాదారు\n• 📊 28 రాష్ట్రాల మార్కెట్ ధరలు\n• 🌤️ స్థానిక వాతావరణ అంచనా\n• 🔬 ఫోటో ద్వారా వ్యాధి గుర్తింపు\n• 🗣️ హిందీ & ఆంగ్లంలో వాయిస్ ఇన్‌పుట్'
          : '🚀 Kisan Mitra AI offers these features:\n\n• 🌾 AI Crop Advisor\n• 📊 Market prices from 28 states\n• 🌤️ Local weather forecast\n• 🔬 Disease ID from photos\n• 🗣️ Voice input in Hindi & English',
      };
    }
    
    // Default response
    return {
      role: 'assistant',
      content: language === 'hi'
        ? '🤔 मुझे आपका प्रश्न समझ नहीं आया। कृपया बाजार भाव, मौसम, फसल सलाह, या रोग पहचान के बारे में पूछें।'
        : language === 'te'
        ? '🤔 మీ ప్రశ్న నాకు అర్థం కాలేదు. దయచేసి మార్కెట్ ధరలు, వాతావరణం, పంట సలహా లేదా వ్యాధి గుర్తింపు గురించి అడగండి.'
        : '🤔 I didn\'t quite understand. Please ask about market prices, weather, crop advice, or disease identification.',
    };
  };

  const handleQuickReply = (id: string) => {
    const queries: Record<string, string> = {
      market: 'Where can I find market prices?',
      weather: 'How do I check weather?',
      chat: 'How do I get crop advice?',
      disease: 'How do I identify crop disease?',
    };
    handleSend(queries[id]);
  };

  const handleSend = (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = processQuery(message);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 500);
  };

  const handleAction = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center"
        aria-label="Open assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-3rem)] bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">
                {language === 'hi' ? 'किसान सहायक' : language === 'te' ? 'కిసాన్ సహాయకుడు' : 'Kisan Assistant'}
              </h3>
              <p className="text-xs text-primary-foreground/80">
                {language === 'hi' ? 'आपकी मदद के लिए हाज़िर' : language === 'te' ? 'మీకు సహాయం చేయడానికి సిద్ధంగా ఉంది' : 'Ready to help you'}
              </p>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[300px] p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {msg.content}
                    {msg.actions && (
                      <div className="mt-2 space-y-1">
                        {msg.actions.map((action, i) => (
                          <Button
                            key={i}
                            size="sm"
                            variant="secondary"
                            className="w-full justify-between text-xs"
                            onClick={() => handleAction(action.path)}
                          >
                            {action.label}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply) => (
                <Button
                  key={reply.id}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickReply(reply.id)}
                >
                  {reply.label[language as keyof typeof reply.label] || reply.label.en}
                </Button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={language === 'hi' ? 'अपना सवाल पूछें...' : language === 'te' ? 'మీ ప్రశ్న అడగండి...' : 'Ask your question...'}
              className="flex-1 text-sm"
            />
            <Button size="icon" onClick={() => handleSend()} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
