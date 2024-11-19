// app/social/messages/[userId]/page.tsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader2, Send, ArrowLeft, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  read?: boolean;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
}

interface User {
  userId: string;
  firstName: string;
  lastName: string;
}

export default function ChatPage({ params }: { params: { userId: string } }) {
  const userId = React.use(Promise.resolve(params.userId));

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalMessages: 0
  });
  const [hasMore, setHasMore] = useState(true);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Fetch user details
  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }, [userId]);

  // Fetch messages with pagination
  const fetchMessages = useCallback(async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages/${userId}?page=${pageNum}&limit=20`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      
      const data = await response.json();
      
      // Append or prepend messages based on page
      setMessages(prev => 
        pageNum === 1 
          ? data.messages 
          : [...data.messages, ...prev]
      );
      
      setPagination(data.pagination);
      setHasMore(pageNum < data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Load more messages when scrolling up
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMessages(nextPage);
    }
  }, [page, isLoading, hasMore, fetchMessages]);

  // Scroll handling
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if scrolled to top
    if (container.scrollTop === 0 && hasMore) {
      handleLoadMore();
    }
  }, [handleLoadMore, hasMore]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/messages/${params.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Initial data fetching
  useEffect(() => {
    fetchUser();
    fetchMessages();
  }, [userId, fetchUser, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/messages">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          {user && (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}`}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>{user.firstName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50"
        onScroll={handleScroll}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLoadMore} 
                disabled={isLoading}
                className="mb-4"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Load More Messages
                  </>
                )}
              </Button>
            </div>
          )}

          {isLoading && messages.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === user?.userId ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.senderId === user?.userId
                      ? 'bg-white rounded-lg rounded-tl-none'
                      : 'bg-blue-500 text-white rounded-lg rounded-tr-none'
                  } px-4 py-2 shadow-sm`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === user?.userId
                        ? 'text-gray-500'
                        : 'text-blue-100'
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button type="submit" disabled={isSending || !newMessage.trim()}>
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}