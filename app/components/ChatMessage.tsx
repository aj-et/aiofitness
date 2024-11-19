// app/components/ChatMessage.tsx
import { formatMessageTime } from '@/utils/dateUtils'; // Assuming you have a date formatting utility
import { message } from '@prisma/client'; // Import Message type from Prisma client

interface ChatMessageProps {
  message: message;
  isOwnMessage: boolean;
  isRead: boolean;
  isLastMessage: boolean;
}

export function ChatMessage({ 
  message, 
  isOwnMessage, 
  isRead, 
  isLastMessage 
}: ChatMessageProps) {
  return (
    <div
      className={`flex ${
        isOwnMessage ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-lg rounded-tr-none'
            : 'bg-white rounded-lg rounded-tl-none'
        } px-4 py-2 shadow-sm relative`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {formatMessageTime(message.timestamp)}
          </span>
          {isOwnMessage && isLastMessage && (
            <span className="text-xs text-blue-100">
              {isRead ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}