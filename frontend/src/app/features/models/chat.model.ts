export interface Message {
  id?: string;
  roomId: string;
  user: string;
  text: string;
  timestamp: Date | string;
  from: string; 
}

export interface ChatThread {
  id: string;
  title: string;
  lastMessage: string;
  lastTimestamp: Date;
  avatarUrl?: string;
}