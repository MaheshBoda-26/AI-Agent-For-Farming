import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { WeatherCard } from '@/components/WeatherCard';
import { CropSuggestionForm } from '@/components/CropSuggestionForm';
import { CropImageAnalysis } from '@/components/CropImageAnalysis';
import { PestAdvisory } from '@/components/PestAdvisory';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Leaf, Camera, Bug } from 'lucide-react';

const Chat = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('chat');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const handleCropSuggestionComplete = (summary: string) => {
    setPendingMessage(summary);
    setActiveTab('chat');
  };

  const handleImageAnalysisComplete = (summary: string) => {
    setPendingMessage(summary);
    setActiveTab('chat');
  };

  const handlePestAdvisoryComplete = (summary: string) => {
    setPendingMessage(summary);
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Main Content Area with Tabs */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
                <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border bg-muted/50">
                  <TabsTrigger value="chat" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'AI चैट' : language === 'te' ? 'AI చాట్' : 'AI Chat'}</span>
                    <span className="sm:hidden">{language === 'hi' ? 'चैट' : 'Chat'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="crops" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                    <Leaf className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'फसल' : language === 'te' ? 'పంట' : 'Crops'}</span>
                    <span className="sm:hidden">{language === 'hi' ? 'फसल' : 'Crops'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="pest" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                    <Bug className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'कीट' : language === 'te' ? 'పురుగు' : 'Pest'}</span>
                    <span className="sm:hidden">{language === 'hi' ? 'कीट' : 'Pest'}</span>
                  </TabsTrigger>
                  <TabsTrigger value="disease" className="flex items-center gap-1 text-xs sm:text-sm px-2">
                    <Camera className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === 'hi' ? 'रोग' : language === 'te' ? 'వ్యాధి' : 'Disease'}</span>
                    <span className="sm:hidden">{language === 'hi' ? 'रोग' : 'Disease'}</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 overflow-hidden m-0">
                  <ChatBox initialMessage={pendingMessage} onMessageSent={() => setPendingMessage(null)} />
                </TabsContent>
                
                <TabsContent value="crops" className="flex-1 overflow-auto m-0 p-4">
                  <CropSuggestionForm onSuggestionComplete={handleCropSuggestionComplete} />
                </TabsContent>
                
                <TabsContent value="pest" className="flex-1 overflow-auto m-0 p-4">
                  <PestAdvisory onAdvisoryComplete={handlePestAdvisoryComplete} />
                </TabsContent>
                
                <TabsContent value="disease" className="flex-1 overflow-auto m-0 p-4">
                  <CropImageAnalysis onAnalysisComplete={handleImageAnalysisComplete} />
                </TabsContent>
              </Tabs>
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
