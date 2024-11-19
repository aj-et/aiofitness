// utils/dateUtils.ts
export function formatMessageTime(date: Date): string {
    const now = new Date();
    const messageDate = new Date(date);
    
    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If within this week, show day
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    if (messageDate > oneWeekAgo) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise, show date
    return messageDate.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
  }