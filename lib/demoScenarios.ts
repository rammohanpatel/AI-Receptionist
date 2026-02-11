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
    visitorName: 'Michael Johnson',
    visitorPurpose: 'scheduled appointment at 2 PM with Ahmed Al Mansoori',
    callMessage: 'Hello Ahmed, Michael Johnson is in the lobby for your scheduled appointment at 2 PM. He is ready to meet with you now.',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to the Innovation Lab at Dubai Holding Real Estate. May I get your name, please?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, my name is Michael Johnson.',
        delay: 2000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Thank you, Mr. Johnson. May I know the purpose of your visit today?',
        delay: 3500,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'I have a scheduled appointment with Ahmed Al Mansoori at 2 PM.',
        delay: 5000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Great! Let me verify your appointment with Ahmed Al Mansoori from the Engineering department. Please give me a moment.',
        delay: 6500,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'assistant',
        content: 'I can confirm your appointment is scheduled. Ahmed is available and I will notify him of your arrival. Please wait while I connect you.',
        delay: 8500,
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
  'walk-in': {
    id: 'walk-in',
    employeeId: 'emp005', // Omar Al Mazrouei
    shouldConnect: true,
    visitorName: 'David Martinez',
    visitorPurpose: 'meeting with Product team regarding project inquiry',
    callMessage: 'Hello Omar, David Martinez is in the lobby. He was looking for Aisha Al Hashimi from Product team, but Aisha is currently in a client workshop until 12 PM. I see your calendar is free. Could you kindly assist this visitor with his project inquiry?',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to the Innovation Lab at Dubai Holding Real Estate. May I get your name, please?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hi, I\'m David Martinez.',
        delay: 2000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Thank you, Mr. Martinez. May I know the purpose of your visit today?',
        delay: 3500,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'I would like to meet with Aisha Al Hashimi from the Product team. Is she available?',
        delay: 5000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Let me check Aisha Al Hashimi\'s availability for you, Mr. Martinez.',
        delay: 6500,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'assistant',
        content: 'I see that Aisha is currently in a client workshop until 12 PM. However, I can connect you with Omar Al Mazrouei, our Senior Product Manager, who is available right now. Would that work for you?',
        delay: 8000,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Yes, that would be perfect. Thank you!',
        delay: 10500,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Excellent! I\'ll notify Omar Al Mazrouei right away. Please wait while I connect you.',
        delay: 12000,
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
    visitorName: 'Robert Chen',
    visitorPurpose: 'Meeting with unclear employee contact',
    callMessage: 'This is an urgent request. Robert Chen is in the lobby. The AI receptionist is facing difficulty understanding the visitor\'s requirement. The visitor is unsure about the employee name and department - mentioned something like Muhammed or Mahmood from possibly IT or Engineering. Kindly come to the reception immediately and take over.',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to the Innovation Lab at Dubai Holding Real Estate. May I get your name, please?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'My name is Robert Chen.',
        delay: 2000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Thank you, Mr. Chen. May I know the purpose of your visit today?',
        delay: 3500,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'I need to speak with... um... I think his name was something like Muhammed... or was it Mahmood?',
        delay: 5000,
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
        delay: 8500,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'I\'m having trouble identifying the specific employee. Let me check if you might be referring to Mohammed Al Falasi from Engineering?',
        delay: 10500,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Hmm, I\'m not certain. It might be someone else.',
        delay: 13000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'I apologize, but I\'m unable to confidently identify the employee you\'re looking for. Let me urgently connect you with our Reception Supervisor who can assist you personally. Please wait a moment.',
        delay: 14500,
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
  'third-party-reference': {
    id: 'third-party-reference',
    employeeId: 'emp011', // Rashid Al Mansoori - Reception Supervisor
    shouldConnect: true,
    isUrgent: true, // Human handoff is urgent
    visitorName: 'John Smith',
    visitorPurpose: 'Requesting master planning documents (Restricted)',
    callMessage: 'This is an urgent request. A visitor named John Smith is in the lobby requesting master planning documents for Reem Island. He claims to have been referred by Ahmed. This appears to be a restricted material request. Please come to reception and verify the visitor\'s credentials and authorization immediately.',
    messages: [
      {
        role: 'assistant',
        content: 'Welcome to the Innovation Lab at Dubai Holding Real Estate. May I get your name, please?',
        delay: 0,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'My name is John Smith.',
        delay: 2000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Thank you, Mr. Smith. May I know the purpose of your visit today?',
        delay: 3500,
        useVoice: true,
        voiceType: 'female',
      },
      {
        role: 'user',
        content: 'Ahmed told me to drop by your office and get the master planning of Reem Island.',
        delay: 5000,
        useVoice: true,
        voiceType: 'male',
      },
      {
        role: 'assistant',
        content: 'Thank you for sharing that, Mr. Smith. I understand you\'re here to collect master planning documents. However, I\'m unable to provide or release such materials directly. Let me connect you with our reception desk who can verify your request and assist you properly.',
        delay: 7000,
        useVoice: true,
        voiceType: 'female',
      },
    ],
  },
};

