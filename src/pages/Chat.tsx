import { Navbar } from '@/components/Navbar';
import { ChatBox } from '@/components/ChatBox';
import { WeatherCard } from '@/components/WeatherCard';

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            {/* Main Chat Area */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              <ChatBox />
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block space-y-4">
              <WeatherCard />
              
              {/* Quick Info Card */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <h3 className="font-semibold text-foreground mb-3">Quick Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span>🌾</span>
                    <span>Ask about specific crops for better advice</span>
                  </li>
                  <li className="flex gap-2">
                    <span>📍</span>
                    <span>Include your location for local weather</span>
                  </li>
                  <li className="flex gap-2">
                    <span>📸</span>
                    <span>Describe pest symptoms in detail</span>
                  </li>
                  <li className="flex gap-2">
                    <span>💬</span>
                    <span>Chat in Hindi or English</span>
                  </li>
                </ul>
              </div>

              {/* Popular Queries */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <h3 className="font-semibold text-foreground mb-3">Popular Questions</h3>
                <ul className="space-y-2 text-sm">
                  <li className="text-primary hover:underline cursor-pointer">When should I sow wheat?</li>
                  <li className="text-primary hover:underline cursor-pointer">How to control aphids in cotton?</li>
                  <li className="text-primary hover:underline cursor-pointer">Best fertilizer for rice?</li>
                  <li className="text-primary hover:underline cursor-pointer">PM-KISAN eligibility?</li>
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
