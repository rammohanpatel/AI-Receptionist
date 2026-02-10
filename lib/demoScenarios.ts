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
  callMessage?: string; // Message to read to employee during call
  visitorName?: string; // Name of the visitor
  visitorPurpose?: string; // Purpose of the visit
  isUrgent?: boolean; // Flag for urgent handover calls
}

export const DEMO_SCENARIOS: Record<string, DemoScenarioData> = {
  scheduled: {
    id: 'scheduled',
    employeeId: 'emp001', // Ahmed Al Mansoori
    shouldConnect: true,
    visitorName: 'Visitor',
    visitorPurpose: 'scheduled appointment at 2 PM',
    callMessage: 'Hello Ahmed, you have a visitor in the lobby for your scheduled appointment at 2 PM. They are ready to meet with you now.',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to Dubai Holding Real Estate, proud to shape some of the UAE\'s most recognized communities. How can I help you today—are you here for a scheduled meeting?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, I have a scheduled appointment with Ahmed Al Mansoori at 2 PM.',
        delay: 2000, // Reduced from 3000
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Great! Let me verify your appointment with Ahmed Al Mansoori from the Engineering department. Please give me a moment.',
        delay: 3500, // Reduced from 6000
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'assistant',
        content: 'I can confirm your appointment is scheduled. Ahmed is available and I will notify him of your arrival. Please wait while I connect you.',
        delay: 5500, // Reduced from 10000
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
  'walk-in': {
    id: 'walk-in',
    employeeId: 'emp005', // Omar Al Mazrouei
    shouldConnect: true,
    visitorName: 'Walk-in Visitor',
    visitorPurpose: 'meeting with Aisha Al Hashimi who is currently unavailable',
    callMessage: 'Hello Omar, there is a visitor in the lobby who was looking for Aisha Al Hashimi from Product team. She is currently in a client workshop until 12 PM. I see your calendar is free. Could you kindly assist this visitor?',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to Dubai Holding Real Estate, proud to shape some of the UAE\'s most recognized communities. How can I help you today—are you here for a scheduled meeting?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, I would like to meet with Aisha Al Hashimi from the Product team. Is she available?',
        delay: 2000, // Reduced from 3000
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Let me check Aisha Al Hashimi\'s availability for you.',
        delay: 3500, // Reduced from 6000
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'assistant',
        content: 'I see that Aisha is currently in a client workshop until 12 PM. However, I can connect you with Omar Al Mazrouei, our Senior Product Manager, who is available right now. Would that work for you?',
        delay: 5000, // Reduced from 9000
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Yes, that would be perfect. Thank you!',
        delay: 7500, // Reduced from 14000
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Excellent! I\'ll notify Omar Al Mazrouei right away. Please wait while I connect you.',
        delay: 9000, // Reduced from 17000
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
  fail: {
    id: 'fail',
    employeeId: 'emp011', // Rashid Al Mansoori - Reception Supervisor
    shouldConnect: true, // Changed from false - now connects for handover
    failureReason: 'Unable to identify employee - requires human assistance',
    isUrgent: true, // Flag this as urgent
    visitorName: 'Confused Visitor',
    visitorPurpose: 'Unable to clearly identify contact person',
    callMessage: 'This is an urgent request. The AI receptionist is facing difficulty understanding the visitor\'s requirement. The visitor is unsure about the employee name and department. Kindly come to the reception immediately and take over.',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to Dubai Holding Real Estate, proud to shape some of the UAE\'s most recognized communities. How can I help you today—are you here for a scheduled meeting?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, I need to speak with... um... I think his name was something like Muhammed... or was it Mahmood?',
        delay: 2000, // Reduced from 3000
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Let me help you find the right person. Could you tell me which department they work in?',
        delay: 4000, // Reduced from 7000
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'I\'m not sure... maybe IT or Engineering? I met him at a conference last month.',
        delay: 5500, // Reduced from 10000
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'I\'m having trouble identifying the specific employee. Let me check if you might be referring to Mohammed Al Falasi from Engineering?',
        delay: 7500, // Reduced from 14000
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hmm, I\'m not certain. It might be someone else.',
        delay: 10000, // Reduced from 18000
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'I apologize, but I\'m unable to confidently identify the employee you\'re looking for. Let me urgently connect you with our Reception Supervisor who can assist you personally. Please wait a moment.',
        delay: 11500, // Reduced from 21000
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
};
