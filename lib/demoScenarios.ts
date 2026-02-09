// Demo conversation scenarios with pre-generated messages
export interface DemoMessage {
  role: 'user' | 'assistant';
  content: string;
  delay: number; // milliseconds from start
  useVoice?: boolean;
  voiceType?: 'male' | 'female'; // male for user, female for AI
}

export interface DemoScenarioData {
  id: string;
  employeeId?: string;
  messages: DemoMessage[];
  shouldConnect: boolean;
  failureReason?: string;
}

export const DEMO_SCENARIOS: Record<string, DemoScenarioData> = {
  scheduled: {
    id: 'scheduled',
    employeeId: 'emp001',
    shouldConnect: true,
    messages: [
      {
        role: 'assistant',
        content: 'Hello! Welcome to our office. How may I help you today?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, I have a scheduled appointment with Ahmed Al Mansoori at 2 PM.',
        delay: 3000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Great! Let me verify your appointment with Ahmed Al Mansoori from the Engineering department. Please give me a moment.',
        delay: 6000,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'assistant',
        content: 'I can confirm your appointment is scheduled. Ahmed is available and I will notify him of your arrival. Please wait while I connect you.',
        delay: 10000,
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
  'walk-in': {
    id: 'walk-in',
    employeeId: 'emp005',
    shouldConnect: true,
    messages: [
      {
        role: 'assistant',
        content: 'Hello! Welcome to our office. How may I help you today?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, I would like to meet with Aisha Al Hashimi from the Product team. Is she available?',
        delay: 3000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Let me check Aisha Al Hashimi\'s availability for you.',
        delay: 6000,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'assistant',
        content: 'I see that Aisha is currently in a client workshop until 12 PM. However, I can connect you with Omar Al Mazrouei, our Senior Product Manager, who is available right now. Would that work for you?',
        delay: 9000,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Yes, that would be perfect. Thank you!',
        delay: 14000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Excellent! I\'ll notify Omar Al Mazrouei right away. Please wait while I connect you.',
        delay: 17000,
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
  fail: {
    id: 'fail',
    shouldConnect: false,
    failureReason: 'Unable to identify employee',
    messages: [
      {
        role: 'assistant',
        content: 'Hello! Welcome to our office. How may I help you today?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, I need to speak with... um... I think his name was something like Muhammed... or was it Mahmood?',
        delay: 3000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Let me help you find the right person. Could you tell me which department they work in?',
        delay: 7000,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'I\'m not sure... maybe IT or Engineering? I met him at a conference last month.',
        delay: 10000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'I\'m having trouble identifying the specific employee. Let me check if you might be referring to Mohammed Al Falasi from Engineering?',
        delay: 14000,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hmm, I\'m not certain. It might be someone else.',
        delay: 18000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'I apologize, but I\'m unable to confidently identify the employee you\'re looking for. Let me connect you with our reception desk where a human assistant can help you better. They\'ll be able to look through our directory with you.',
        delay: 21000,
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
};
