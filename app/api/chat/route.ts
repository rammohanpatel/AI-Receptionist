import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByName, checkAvailability, getFallbackEmployee } from '@/lib/employees';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // System prompt for structured response
    const systemPrompt = `You are an AI receptionist for a corporate office. Your job is to:
1. Understand visitor intent
2. Extract employee name and department
3. Provide helpful, professional responses

Rules:
- Be polite and professional
- Keep responses concise (1-2 sentences)
- If name is unclear, ask for clarification
- Always confirm before taking action

Respond in JSON format:
{
  "intent": "make_call" | "ask_question" | "leave_message" | "unknown",
  "employee": "extracted employee name or null",
  "department": "extracted department or null",
  "confidence": 0.0-1.0,
  "response": "what to say to the visitor"
}`;

    const conversationContext = conversationHistory
      ?.map((msg: any) => `${msg.role}: ${msg.content}`)
      .join('\n') || '';

    const prompt = `${systemPrompt}

Conversation history:
${conversationContext}

Visitor says: "${message}"

Provide your response in JSON format only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up response (remove markdown code blocks if present)
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let aiResponse;
    try {
      aiResponse = JSON.parse(text);
    } catch (e) {
      // Fallback if JSON parsing fails
      aiResponse = {
        intent: 'unknown',
        employee: null,
        department: null,
        confidence: 0.5,
        response: text
      };
    }

    // Process intent and check availability
    if (aiResponse.intent === 'make_call' && aiResponse.employee) {
      const employee = findEmployeeByName(aiResponse.employee);
      
      if (!employee) {
        return NextResponse.json({
          ...aiResponse,
          response: `I couldn't find ${aiResponse.employee} in our directory. Could you please provide their full name or department?`,
          employee: null
        });
      }

      const availability = checkAvailability(employee);
      
      if (!availability.isAvailable) {
        const fallback = getFallbackEmployee(employee.id);
        
        if (fallback) {
          return NextResponse.json({
            ...aiResponse,
            response: `${employee.name} is currently ${availability.reason ? `in a ${availability.reason}` : 'unavailable'}. I can connect you with ${fallback.name} from the same team instead. Would that work for you?`,
            employee: employee.name,
            fallbackEmployee: fallback.name,
            employeeId: employee.id,
            fallbackEmployeeId: fallback.id,
            requiresConfirmation: true
          });
        } else {
          return NextResponse.json({
            ...aiResponse,
            response: `${employee.name} is currently ${availability.reason ? `in a ${availability.reason}` : 'unavailable'} and will be free at ${availability.nextAvailable || 'later today'}. Would you like to leave a message?`,
            employee: employee.name,
            employeeId: employee.id
          });
        }
      }

      // Employee is available
      return NextResponse.json({
        ...aiResponse,
        response: `Perfect! I'll connect you with ${employee.name} from ${employee.department}. Please wait for a moment while I notify them.`,
        employee: employee.name,
        employeeId: employee.id,
        canProceedWithCall: true
      });
    }

    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      {
        intent: 'unknown',
        response: 'I apologize, but I\'m having trouble processing your request. Could you please repeat that?',
        error: error.message
      },
      { status: 500 }
    );
  }
}
