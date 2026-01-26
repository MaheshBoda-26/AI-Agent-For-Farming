import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatMessage } from './ChatMessage';
import { QuickActions } from './QuickActions';
import { VoiceInput } from './VoiceInput';
import { Send, Leaf, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ChatBox = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [location] = useState('India'); // Can be made dynamic later
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, error, sendMessage, clearMessages } = useChat({
    language,
    location,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (error) {
      toast({
        title: language === 'hi' ? 'त्रुटि' : 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error, language, toast]);

  // Show welcome message
  const displayMessages = messages.length === 0
    ? [{ role: 'assistant' as const, content: t('chat.welcome') }]
    : messages;

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setInput('');
    await sendMessage(text);
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
        <div className="flex-1">
          <h2 className="font-semibold text-foreground">AI Farming Assistant</h2>
          <p className="text-xs text-muted-foreground">
            {isLoading ? t('chat.thinking') : 'Powered by AI'}
          </p>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-muted-foreground hover:text-foreground"
          >
            {t('chat.clear')}
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
        {displayMessages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <ChatMessage role="assistant" content="" isLoading />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="p-4 border-t border-border bg-card">
          <QuickActions onSelect={handleSend} />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="px-4 py-2 bg-destructive/10 border-t border-destructive/20 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <VoiceInput 
            onTranscript={(text) => setInput(prev => prev ? `${prev} ${text}` : text)} 
            disabled={isLoading}
          />
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
