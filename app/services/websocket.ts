// app/services/websocket.ts
export class WebSocketService {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private messageHandlers: ((message: any) => void)[] = [];
  
    constructor(private userId: string) {
      this.connect();
    }
  
    private connect() {
      this.ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/messages?userId=${this.userId}`);
      
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        this.messageHandlers.forEach(handler => handler(message));
      };
  
      this.ws.onclose = () => {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), 1000 * Math.pow(2, this.reconnectAttempts));
        }
      };
    }
  
    public onMessage(handler: (message: any) => void) {
      this.messageHandlers.push(handler);
      return () => {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
      };
    }
  
    public disconnect() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
  }