import { memo, useState, useCallback } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  currentMessage: string;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

/**
 * RESPONSIVE Message Input System
 * 
 * Mobile: Full width, compact layout
 * Tablet/Desktop: Full width within panel
 */
export const MessageInput = memo(function MessageInput({
  currentMessage,
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  }, [inputValue, onSendMessage]);

  const handleClear = useCallback(() => {
    onSendMessage('');
    setInputValue('');
  }, [onSendMessage]);

  return (
    <div className="rounded-xl bg-secondary/30 border border-border/40 p-2 sm:p-3 space-y-1.5 sm:space-y-2">
      {/* Header */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
        <span className="text-[10px] sm:text-xs font-medium text-foreground">Message to Robot</span>
      </div>

      {/* Current Message Display */}
      {currentMessage && (
        <div className="flex items-center justify-between bg-primary/5 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-primary/20">
          <p className="text-xs sm:text-sm text-foreground truncate flex-1">{currentMessage}</p>
          <button
            onClick={handleClear}
            className="ml-2 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            Clear
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-1.5 sm:gap-2">
        <Input
          type="text"
          placeholder="Type message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          className="flex-1 h-8 sm:h-9 text-xs sm:text-sm bg-background/80 border-border/50"
          maxLength={100}
        />
        <Button
          type="submit"
          size="sm"
          disabled={disabled || !inputValue.trim()}
          className="h-8 sm:h-9 px-2.5 sm:px-3 min-w-[44px]"
        >
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Button>
      </form>
    </div>
  );
});
