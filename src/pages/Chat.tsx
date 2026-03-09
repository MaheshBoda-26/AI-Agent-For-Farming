import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { WeatherCard } from '@/components/WeatherCard';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AudioLines } from 'lucide-react';

const Chat = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  // Check for initial message from navigation state (from Tools page)
  useEffect(() => {
    if (location.state?.initialMessage) {
      setInitialMessage(location.state.initialMessage);
      // Clear the state to prevent re-sending on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Main Chat Area */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              <ChatBox 
                initialMessage={initialMessage} 
                onMessageSent={() => setInitialMessage(null)} 
              />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block space-y-4 overflow-auto">
              <WeatherCard />
              
              {/* Quick Info Card */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('chat.tips.title')}</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span>🌾</span>
                    <span>{t('chat.tips.1')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span>📍</span>
                    <span>{t('chat.tips.2')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span>📸</span>
                    <span>{t('chat.tips.3')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span>💬</span>
                    <span>{t('chat.tips.4')}</span>
                  </li>
                </ul>
              </div>

              {/* Popular Queries */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{t('chat.popular.title')}</h3>
                <ul className="space-y-2 text-sm">
                  <li className="text-primary hover:underline cursor-pointer">{t('chat.popular.1')}</li>
                  <li className="text-primary hover:underline cursor-pointer">{t('chat.popular.2')}</li>
                  <li className="text-primary hover:underline cursor-pointer">{t('chat.popular.3')}</li>
                  <li className="text-primary hover:underline cursor-pointer">{t('chat.popular.4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
