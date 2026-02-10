import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { findEmployeeByName, checkAvailability, getFallbackEmployee, EMPLOYEES } from '@/lib/employees';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // System prompt for structured response with mandatory name/purpose workflow
    const systemPrompt = `You are an AI receptionist for Dubai Holding Real Estate corporate office.

MANDATORY WORKFLOW (MUST FOLLOW IN ORDER):
1. FIRST: Always ask for visitor's name if not yet collected
   - "Sir/Madam, may I get your name, please?"
   - Do not proceed without capturing name
   
2. SECOND: Always ask for purpose of visit after name is captured
   - "Thank you, [Name]. May I know the purpose of your visit?"
   - Do not proceed without understanding purpose

3. THIRD: Process the request based on purpose
   - If requesting employee connection → route to employee
   - If requesting restricted/confidential materials → human handoff
   - If third-party reference without proper authorization → human handoff
   - If information request → answer or route appropriately

CRITICAL RULES:
- Never bypass asking for name first
- Never bypass asking for purpose second
- Never provide or promise access to restricted materials (master plans, confidential documents, internal data)
- If visitor references someone but requests restricted info → human handoff with context
- Use visitor's name throughout conversation for personalization
- Detect when visitor is asking for things beyond your authority → escalate to human desk

INTENTS:
- "collect_name": Need to ask for visitor's name
- "collect_purpose": Need to ask for purpose of visit
- "make_call": Ready to connect to employee (name & purpose collected)
- "human_handoff": Request involves restricted access, third-party claims, or out of scope
- "confirm_yes": Visitor confirms suggestion
- "confirm_no": Visitor denies suggestion
- "ask_question": General question
- "unknown": Unclear intent

Respond in JSON format:
{
  "intent": "collect_name" | "collect_purpose" | "make_call" | "human_handoff" | "confirm_yes" | "confirm_no" | "ask_question" | "unknown",
  "visitorName": "extracted name or null",
  "purposeOfVisit": "extracted purpose or null",
  "employee": "extracted employee name or null",
  "department": "extracted department or null",
  "hasRestrictedRequest": boolean,
  "thirdPartyReference": "person mentioned as reference or null",
  "confidence": 0.0-1.0,
  "response": "what to say to the visitor",
  "requiresHumanDesk": boolean
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

    // Handle mandatory name collection (highest priority)
    if (aiResponse.intent === 'collect_name') {
      return NextResponse.json({
        intent: 'collect_name',
        response: aiResponse.response || "Sir, may I get your name, please?",
        requiresName: true
      });
    }

    // Handle mandatory purpose collection (second priority)
    if (aiResponse.intent === 'collect_purpose') {
      return NextResponse.json({
        intent: 'collect_purpose',
        response: aiResponse.response,
        visitorName: aiResponse.visitorName,
        requiresPurpose: true
      });
    }

    // Handle human handoff for restricted/third-party requests
    if (aiResponse.intent === 'human_handoff' || aiResponse.requiresHumanDesk) {
      return NextResponse.json({
        intent: 'human_handoff',
        response: aiResponse.response || "Thank you for sharing that. I'm unable to assist with this request directly. Let me connect you with our reception desk for assistance.",
        visitorName: aiResponse.visitorName,
        purposeOfVisit: aiResponse.purposeOfVisit,
        thirdPartyReference: aiResponse.thirdPartyReference,
        hasRestrictedRequest: aiResponse.hasRestrictedRequest,
        employeeId: 'emp011', // Rashid Al Mansoori - Reception Supervisor
        canProceedWithCall: true,
        isUrgent: true, // Mark as urgent for human handoff
        requiresHumanDesk: true
      });
    }

    // Handle confirmation responses - check if previous message had requiresConfirmation
    const lastMessage = conversationHistory?.[conversationHistory.length - 1];
    const previouslyAskedAbout = lastMessage?.content?.match(/I found ([\w\s]+) in/)?.[1];
    
    if ((aiResponse.intent === 'confirm_yes' || 
         message.toLowerCase().match(/\b(yes|yeah|yep|sure|correct|right|exactly|that's right)\b/)) 
        && previouslyAskedAbout) {
      // User confirmed the smart match
      const employee = findEmployeeByName(previouslyAskedAbout);
      
      if (employee) {
        const availability = checkAvailability(employee);
        
        if (!availability.isAvailable) {
          const fallback = getFallbackEmployee(employee.id);
          
          if (fallback) {
            return NextResponse.json({
              intent: 'make_call',
              response: `${employee.name} is currently ${availability.reason ? `in a ${availability.reason}` : 'unavailable'}. I can connect you with ${fallback.name} from the same team instead. Would that work for you?`,
              employee: employee.name,
              fallbackEmployee: fallback.name,
              employeeId: employee.id,
              fallbackEmployeeId: fallback.id,
              requiresConfirmation: true
            });
          }
        }
        
        // Employee is available, proceed with call
        return NextResponse.json({
          intent: 'make_call',
          response: `Perfect! I'll connect you with ${employee.name} from ${employee.department}. Please wait while I notify them.`,
          employee: employee.name,
          employeeId: employee.id,
          visitorName: aiResponse.visitorName,
          purposeOfVisit: aiResponse.purposeOfVisit,
          canProceedWithCall: true
        });
      }
    }
    
    // Handle negative confirmation - user said no to the suggestion
    if ((aiResponse.intent === 'confirm_no' || 
         message.toLowerCase().match(/\b(no|nope|not|wrong|different|someone else)\b/)) 
        && previouslyAskedAbout) {
      return NextResponse.json({
        intent: 'ask_question',
        response: `I apologize for the confusion. Could you please spell out the full name of the person you'd like to meet, or tell me which department they work in?`,
        employee: null,
        showDirectory: true
      });
    }

    // Process intent and check availability
    if (aiResponse.intent === 'make_call' && aiResponse.employee) {
      let employee = findEmployeeByName(aiResponse.employee);
      
      // If no direct match, use Gemini to intelligently match the name
      if (!employee) {
        console.log(`[Smart Match] No direct match for "${aiResponse.employee}", using AI inference...`);
        
        // Prepare employee list for Gemini
        const employeeList = EMPLOYEES.map(emp => ({
          name: emp.name,
          department: emp.department,
          title: emp.title
        }));
        
        const matchingPrompt = `You are helping match a visitor's request to an employee in our directory.

The visitor mentioned: "${aiResponse.employee}"
This could be a partial name, misspelling, or unclear pronunciation.

Our employee directory:
${JSON.stringify(employeeList, null, 2)}

Task:
1. Find the MOST LIKELY employee the visitor is trying to reach
2. Consider: similar names, phonetic similarity, common misspellings, partial names
3. If confident (>70%), suggest the match for confirmation
4. If uncertain (<70%), return null

Respond in JSON format:
{
  "matchedName": "Full employee name from directory or null",
  "confidence": 0.0-1.0,
  "reasoning": "Why you think this is the match"
}`;

        try {
          const matchResult = await model.generateContent(matchingPrompt);
          const matchResponse = await matchResult.response;
          let matchText = matchResponse.text();
          matchText = matchText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          
          const matchData = JSON.parse(matchText);
          console.log(`[Smart Match] AI suggestion:`, matchData);
          
          if (matchData.matchedName && matchData.confidence > 0.7) {
            employee = findEmployeeByName(matchData.matchedName);
            
            if (employee) {
              // Found a match! Ask for confirmation
              return NextResponse.json({
                ...aiResponse,
                response: `I found ${employee.name} in ${employee.department} department. Is this who you're looking for?`,
                employee: employee.name,
                employeeId: employee.id,
                department: employee.department,
                requiresConfirmation: true,
                smartMatch: true,
                confidence: matchData.confidence
              });
            }
          }
        } catch (matchError) {
          console.error('[Smart Match] Error:', matchError);
        }
        
        // If still no match, ask for clarification
        return NextResponse.json({
          ...aiResponse,
          response: `I couldn't find "${aiResponse.employee}" in our directory. Could you please provide their full name or tell me which department they work in? I can show you our employee directory if that helps.`,
          employee: null,
          showDirectory: true
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
        visitorName: aiResponse.visitorName,
        purposeOfVisit: aiResponse.purposeOfVisit,
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
