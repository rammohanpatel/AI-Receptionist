// Employee data structure
export interface Employee {
  id: string;
  name: string;
  department: string;
  title: string;
  email: string;
  avatar?: string;
  isAvailable: boolean;
  meetings: Meeting[];
  fallbackEmployee?: string;
}

export interface Meeting {
  start: string;
  end: string;
  title: string;
}

// AI Response types
export interface AIIntent {
  intent: 'make_call' | 'ask_question' | 'leave_message' | 'unknown';
  employee?: string;
  department?: string;
  confidence: number;
}

// Conversation types
export type ConversationState = 
  | 'idle' 
  | 'listening' 
  | 'thinking' 
  | 'speaking' 
  | 'calling';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Call types
export interface CallState {
  isActive: boolean;
  employee?: Employee;
  status: 'connecting' | 'ringing' | 'connected' | 'ended';
  countdown?: number;
  duration: number;
}
