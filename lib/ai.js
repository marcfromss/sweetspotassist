import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// AI-powered lead scoring
export async function scoreLead(leadData) {
  try {
    const prompt = `
      Analyze this insurance lead and provide a score from 1-10 based on:
      - Contact information completeness
      - Company/position relevance
      - Source quality
      - Potential policy value
      
      Lead Data: ${JSON.stringify(leadData)}
      
      Return only a JSON object with: {"score": number, "reasoning": "string", "priority": "LOW|MEDIUM|HIGH|URGENT"}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error scoring lead:', error);
    return { score: 5, reasoning: 'Unable to score', priority: 'MEDIUM' };
  }
}

// Smart reply suggestions
export async function generateReplySuggestion(conversationHistory, context) {
  try {
    const prompt = `
      As an insurance agent, suggest a professional reply to this conversation.
      Consider the context and maintain a helpful, professional tone.
      
      Conversation History: ${conversationHistory}
      Context: ${context}
      
      Provide 3 different reply options, each with a different tone:
      1. Professional and formal
      2. Friendly and approachable  
      3. Direct and solution-focused
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    return response.content[0].text;
  } catch (error) {
    console.error('Error generating reply suggestion:', error);
    return "Thank you for your message. I'll get back to you shortly.";
  }
}

// Task prioritization
export async function prioritizeTasks(tasks, context) {
  try {
    const prompt = `
      Prioritize these insurance agent tasks based on:
      - Policy status and urgency
      - Client importance
      - Commission potential
      - Regulatory deadlines
      
      Tasks: ${JSON.stringify(tasks)}
      Context: ${context}
      
      Return a JSON array with reordered tasks and priority scores.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    return tasks; // Return original order if AI fails
  }
}

// Compliance checking
export async function checkCompliance(content, type) {
  try {
    const prompt = `
      Check this ${type} content for insurance compliance issues:
      - Script violations
      - Missing required disclosures
      - Regulatory requirements
      - Ethical concerns
      
      Content: ${content}
      
      Return JSON: {"compliant": boolean, "issues": ["array of issues"], "suggestions": ["array of suggestions"]}
    `;

    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.content[0].text);
  } catch (error) {
    console.error('Error checking compliance:', error);
    return { compliant: true, issues: [], suggestions: [] };
  }
}

// Document analysis with OCR
export async function analyzeDocument(ocrText, documentType) {
  try {
    const prompt = `
      Analyze this ${documentType} document and extract key information:
      - Policy numbers
      - Dates
      - Amounts
      - Names
      - Missing information
      
      OCR Text: ${ocrText}
      
      Return JSON with extracted data and any missing required fields.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing document:', error);
    return { extracted: {}, missing: [] };
  }
}

// Commission prediction
export async function predictCommission(policyData, marketData) {
  try {
    const prompt = `
      Predict commission potential for this insurance policy based on:
      - Policy type and coverage
      - Client profile
      - Market conditions
      - Historical data
      
      Policy: ${JSON.stringify(policyData)}
      Market: ${JSON.stringify(marketData)}
      
      Return JSON: {"predictedCommission": number, "confidence": number, "factors": ["array of factors"]}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('Error predicting commission:', error);
    return { predictedCommission: 0, confidence: 0, factors: [] };
  }
} 