export type ChatMode = 'customer-service' | 'mental-health' | 'learning' | 'fun-chat';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatModeConfig {
  id: ChatMode;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  prompt: string;
}