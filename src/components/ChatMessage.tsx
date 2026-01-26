import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export const ChatMessage = ({ role, content, isLoading }: ChatMessageProps) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-secondary' : 'bg-primary'
        }`}
      >
        {isUser ? (
          <User className="h-5 w-5 text-secondary-foreground" />
        ) : (
          <Bot className="h-5 w-5 text-primary-foreground" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border text-card-foreground rounded-tl-sm'
        }`}
      >
        {isLoading ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <div className="text-sm md:text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="mb-0">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                h1: ({ children }) => <h3 className="font-bold text-lg mb-2 mt-3 first:mt-0">{children}</h3>,
                h2: ({ children }) => <h4 className="font-bold text-base mb-2 mt-3 first:mt-0">{children}</h4>,
                h3: ({ children }) => <h5 className="font-semibold mb-1 mt-2 first:mt-0">{children}</h5>,
                code: ({ children }) => (
                  <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
