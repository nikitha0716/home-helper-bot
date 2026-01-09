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
 * Message Input System - Send messages to robot display
 * 
 * - Clean, dedicated input area
 * - Separate from logs and status
 * - Instantly updates robot display
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
    <div className="rounded-xl bg-secondary/30 border border-border/40 p-3 space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-foreground">Message to Robot</span>
      </div>

      {/* Current Message Display */}
      {currentMessage && (
        <div className="flex items-center justify-between bg-primary/5 rounded-lg px-3 py-2 border border-primary/20">
          <p className="text-sm text-foreground truncate flex-1">{currentMessage}</p>
          <button
            onClick={handleClear}
            className="ml-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Type message to display on robot..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={disabled}
          className="flex-1 h-9 text-sm bg-background/80 border-border/50"
          maxLength={100}
        />
        <Button
          type="submit"
          size="sm"
          disabled={disabled || !inputValue.trim()}
          className="h-9 px-3"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
});
