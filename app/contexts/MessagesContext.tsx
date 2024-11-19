// app/contexts/MessagesContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  read: boolean;
}

interface MessagesState {
  messages: Record<string, Message[]>;
  unreadCounts: Record<string, number>;
  loading: boolean;
  error: string | null;
}

type MessagesAction = 
  | { type: 'SET_MESSAGES'; payload: { userId: string; messages: Message[] } }
  | { type: 'ADD_MESSAGE'; payload: { userId: string; message: Message } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'UPDATE_UNREAD_COUNT'; payload: { userId: string; count: number } };

const MessagesContext = createContext<{
  state: MessagesState;
  dispatch: React.Dispatch<MessagesAction>;
  sendMessage: (userId: string, content: string) => Promise<void>;
} | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const initialState: MessagesState = {
    messages: {},
    unreadCounts: {},
    loading: false,
    error: null
  };

  function messagesReducer(state: MessagesState, action: MessagesAction): MessagesState {
    switch (action.type) {
      case 'SET_MESSAGES':
        return {
          ...state,
          messages: {
            ...state.messages,
            [action.payload.userId]: action.payload.messages
          }
        };
      case 'ADD_MESSAGE':
        const currentMessages = state.messages[action.payload.userId] || [];
        return {
          ...state,
          messages: {
            ...state.messages,
            [action.payload.userId]: [...currentMessages, action.payload.message]
          }
        };
      case 'SET_LOADING':
        return { ...state, loading: action.payload };
      case 'SET_ERROR':
        return { ...state, error: action.payload };
      case 'UPDATE_UNREAD_COUNT':
        return {
          ...state,
          unreadCounts: {
            ...state.unreadCounts,
            [action.payload.userId]: action.payload.count
          }
        };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(messagesReducer, initialState);
  const { getToken } = useAuth();

  const sendMessage = async (userId: string, content: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const token = await getToken();
      const response = await fetch(`/api/messages/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Failed to send message');

      const message = await response.json();
      dispatch({ type: 'ADD_MESSAGE', payload: { userId, message } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to send message' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <MessagesContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </MessagesContext.Provider>
  );
}

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return context;
};