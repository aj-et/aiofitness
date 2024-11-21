// app/utils/api.ts

export async function fetchMessages(userId: string, page: number, limit: number = 20) {
    const response = await fetch(
      `/api/messages/${userId}?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  }