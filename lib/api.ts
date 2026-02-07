// API client utilities

export async function speechToText(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  const response = await fetch('/api/speech-to-text', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Speech-to-text conversion failed');
  }

  const data = await response.json();
  return data.text;
}

export async function textToSpeech(text: string): Promise<Blob> {
  const response = await fetch('/api/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error('Text-to-speech conversion failed');
  }

  return await response.blob();
}

export interface ChatResponse {
  intent: string;
  employee?: string;
  department?: string;
  confidence: number;
  response: string;
  fallbackEmployee?: string;
  employeeId?: string;
  fallbackEmployeeId?: string;
  requiresConfirmation?: boolean;
  canProceedWithCall?: boolean;
}

export async function chat(
  message: string,
  conversationHistory: any[]
): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      conversationHistory,
    }),
  });

  if (!response.ok) {
    throw new Error('AI chat processing failed');
  }

  return await response.json();
}
