// app/utils/api.ts

export async function fetchMessages(userId: string, page: number, limit: number = 20) {
    const response = await fetch(
      `/api/messages/${userId}?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  }
  
  // You can add other API utility functions here
  export async function fetchChats() {
    const response = await fetch('/api/messages/chats');
    if (!response.ok) throw new Error('Failed to fetch chats');
    return response.json();
  }