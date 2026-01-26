import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { Send, Leaf } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBox = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: t('chat.welcome'),
        },
      ]);
    }
  }, [language]);

  const generateResponse = (userMessage: string): string => {
    // Simulate AI response based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (language === 'hi') {
      if (lowerMessage.includes('फसल') || lowerMessage.includes('crop')) {
        return `🌾 फसल सलाह:

अभी करें:
• अपनी मिट्टी की नमी जांचें
• खरपतवार हटाएं
• सुबह या शाम को सिंचाई करें

अगले 7 दिन:
• मौसम की निगरानी रखें
• यदि बारिश हो तो सिंचाई रोकें
• खाद की जरूरत का मूल्यांकन करें

⚠️ सावधानी: भारी बारिश की संभावना है। जल निकासी की व्यवस्था करें।

✅ विश्वास स्कोर: 85%`;
      }
      
      if (lowerMessage.includes('मौसम') || lowerMessage.includes('weather')) {
        return `🌤️ मौसम पूर्वानुमान:

आज: 28°C, धूप
कल: 27°C, आंशिक बादल
बुधवार: 25°C, बारिश की संभावना

⚠️ अलर्ट: बुधवार को बारिश की 70% संभावना। बुवाई स्थगित करें।

✅ विश्वास स्कोर: 90%`;
      }
      
      if (lowerMessage.includes('कीट') || lowerMessage.includes('pest')) {
        return `🐛 कीट प्रबंधन:

लक्षण बताएं:
• पत्तियों पर छेद?
• पत्तियां पीली हो रही हैं?
• तने पर कीट दिखे?

सामान्य उपचार:
• नीम का तेल स्प्रे करें
• प्रभावित पत्तियां हटाएं
• सुबह जल्दी छिड़काव करें

⚠️ गंभीर होने पर कृषि अधिकारी से संपर्क करें।

✅ विश्वास स्कोर: 75%`;
      }
      
      if (lowerMessage.includes('मंडी') || lowerMessage.includes('भाव') || lowerMessage.includes('market')) {
        return `📊 मंडी भाव (आज):

गेहूं: ₹2,150 - ₹2,250/क्विंटल
चावल: ₹2,800 - ₹3,100/क्विंटल  
कपास: ₹6,500 - ₹7,200/क्विंटल

📍 नजदीकी मंडी: वारंगल, तेलंगाना

💡 सुझाव: अगले 3-5 दिनों में कीमतें बढ़ने की उम्मीद है।

✅ विश्वास स्कोर: 80%`;
      }
      
      return `नमस्ते! मैं समझ गया। कृपया बताएं कि आपको किस विषय पर मदद चाहिए:

🌾 फसल सलाह
🌤️ मौसम जानकारी
🐛 कीट नियंत्रण
📊 मंडी भाव

आप अपना सवाल विस्तार से पूछ सकते हैं।`;
    }
    
    // English responses
    if (lowerMessage.includes('crop') || lowerMessage.includes('advice')) {
      return `🌾 Crop Advisory:

What to do now:
• Check soil moisture levels
• Remove weeds around plants
• Water early morning or evening

Next 7 days plan:
• Monitor weather conditions
• Skip irrigation if rain expected
• Assess fertilizer requirements

⚠️ Risk Warning: Heavy rain expected in 3 days. Ensure proper drainage.

✅ Confidence Score: 85%`;
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain')) {
      return `🌤️ Weather Forecast:

Today: 28°C, Sunny
Tomorrow: 27°C, Partly Cloudy
Wednesday: 25°C, Rain Expected

⚠️ Alert: 70% chance of rain on Wednesday. Consider postponing sowing.

✅ Confidence Score: 90%`;
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('insect')) {
      return `🐛 Pest Management:

Please describe symptoms:
• Holes in leaves?
• Yellowing leaves?
• Insects on stems?

General Treatment:
• Apply neem oil spray
• Remove affected leaves
• Spray early morning

⚠️ For severe cases, contact your local agriculture officer.

✅ Confidence Score: 75%`;
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('mandi')) {
      return `📊 Market Prices (Today):

Wheat: ₹2,150 - ₹2,250/quintal
Rice: ₹2,800 - ₹3,100/quintal
Cotton: ₹6,500 - ₹7,200/quintal

📍 Nearest Mandi: Warangal, Telangana

💡 Tip: Prices expected to rise in next 3-5 days.

✅ Confidence Score: 80%`;
    }
    
    return `Hello! I understand. Please tell me what you need help with:

🌾 Crop Advice
🌤️ Weather Information
🐛 Pest Control
📊 Market Prices

Feel free to ask your question in detail.`;
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const response = generateResponse(text);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <Leaf className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">AI Farming Assistant</h2>
          <p className="text-xs text-muted-foreground">Always here to help</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
          />
        ))}
        {isLoading && (
          <ChatMessage role="assistant" content="" isLoading />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-border bg-card">
          <QuickActions onSelect={handleSend} />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder')}
            className="flex-1 text-base"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
