// Mock AI service that works without API keys
// This provides realistic responses for testing and development

// AI-powered lead scoring
export async function scoreLead(leadData) {
  try {
    // Mock scoring based on data completeness and quality
    let score = 5; // Base score
    let reasoning = '';
    let priority = 'MEDIUM';

    // Score based on contact information completeness
    if (leadData.email && leadData.phone) score += 2;
    if (leadData.company && leadData.position) score += 2;
    
    // Score based on source
    if (leadData.source === 'REFERRAL') score += 1;
    if (leadData.source === 'WEBSITE') score += 1;
    
    // Determine priority
    if (score >= 8) priority = 'HIGH';
    if (score >= 9) priority = 'URGENT';
    if (score <= 4) priority = 'LOW';

    reasoning = `Lead scored ${score}/10 based on contact completeness, company info, and source quality.`;

    return { score, reasoning, priority };
  } catch (error) {
    console.error('Error scoring lead:', error);
    return { score: 5, reasoning: 'Unable to score', priority: 'MEDIUM' };
  }
}

// Smart reply suggestions
export async function generateReplySuggestion(conversationHistory, context) {
  try {
    const replies = [
      "Thank you for your message. I'll review your inquiry and get back to you within 24 hours with a detailed response.",
      "I appreciate you reaching out. Let me gather some information about your specific needs and I'll call you tomorrow to discuss options.",
      "Thanks for contacting us. I'd be happy to help you with your insurance needs. When would be a good time for a brief phone call?"
    ];
    
    return replies[Math.floor(Math.random() * replies.length)];
  } catch (error) {
    console.error('Error generating reply suggestion:', error);
    return "Thank you for your message. I'll get back to you shortly.";
  }
}

// Task prioritization
export async function prioritizeTasks(tasks, context) {
  try {
    // Simple prioritization based on due date and type
    const prioritized = [...tasks].sort((a, b) => {
      // Urgent tasks first
      if (a.priority === 'URGENT' && b.priority !== 'URGENT') return -1;
      if (b.priority === 'URGENT' && a.priority !== 'URGENT') return 1;
      
      // High priority tasks
      if (a.priority === 'HIGH' && b.priority !== 'HIGH') return -1;
      if (b.priority === 'HIGH' && a.priority !== 'HIGH') return 1;
      
      // Sort by due date
      return new Date(a.dueDate) - new Date(b.dueDate);
    });

    return prioritized;
  } catch (error) {
    console.error('Error prioritizing tasks:', error);
    return tasks; // Return original order if prioritization fails
  }
}

// Compliance checking
export async function checkCompliance(content, type) {
  try {
    const issues = [];
    const suggestions = [];
    
    // Basic compliance checks
    if (content.toLowerCase().includes('guarantee')) {
      issues.push('Avoid using "guarantee" language');
      suggestions.push('Use "may" or "could" instead of "guarantee"');
    }
    
    if (content.toLowerCase().includes('best rate')) {
      issues.push('Avoid "best rate" claims');
      suggestions.push('Use "competitive rates" or "market rates"');
    }
    
    return {
      compliant: issues.length === 0,
      issues,
      suggestions
    };
  } catch (error) {
    console.error('Error checking compliance:', error);
    return { compliant: true, issues: [], suggestions: [] };
  }
}

// Document analysis with OCR
export async function analyzeDocument(ocrText, documentType) {
  try {
    const extracted = {
      policyNumbers: [],
      dates: [],
      amounts: [],
      names: []
    };
    
    const missing = [];
    
    // Basic extraction (in real implementation, this would use AI)
    if (ocrText) {
      // Extract policy numbers (basic pattern matching)
      const policyMatches = ocrText.match(/POL[-\s]?\d{4}[-\s]?\d{4}/gi);
      if (policyMatches) extracted.policyNumbers = policyMatches;
      
      // Extract dates
      const dateMatches = ocrText.match(/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/g);
      if (dateMatches) extracted.dates = dateMatches;
      
      // Extract amounts
      const amountMatches = ocrText.match(/\$\d{1,3}(,\d{3})*(\.\d{2})?/g);
      if (amountMatches) extracted.amounts = amountMatches;
    }
    
    // Check for missing required fields based on document type
    if (documentType === 'APPLICATION') {
      if (!extracted.names.length) missing.push('Client name');
      if (!extracted.dates.length) missing.push('Application date');
    }
    
    return { extracted, missing };
  } catch (error) {
    console.error('Error analyzing document:', error);
    return { extracted: {}, missing: [] };
  }
}

// Commission prediction
export async function predictCommission(policyData, marketData) {
  try {
    // Simple prediction based on policy type and premium
    let predictedCommission = 0;
    let confidence = 0.7;
    let factors = [];
    
    if (policyData.premium) {
      // Estimate commission as 10-20% of premium
      const commissionRate = policyData.commissionRate || 0.15;
      predictedCommission = policyData.premium * commissionRate;
      
      factors.push(`Based on ${commissionRate * 100}% commission rate`);
      factors.push(`Policy premium: $${policyData.premium}`);
    }
    
    if (policyData.type) {
      factors.push(`Policy type: ${policyData.type}`);
    }
    
    return {
      predictedCommission: Math.round(predictedCommission * 100) / 100,
      confidence,
      factors
    };
  } catch (error) {
    console.error('Error predicting commission:', error);
    return { predictedCommission: 0, confidence: 0, factors: [] };
  }
} 