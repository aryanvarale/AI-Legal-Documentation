// Test script for Mistral API
import { Mistral } from '@mistralai/mistralai';

// Get API key from environment or use hardcoded key for testing
const MISTRAL_API_KEY = process.env.VITE_MISTRAL_API_KEY || 'jRuxrXPaXaoCLMEarL3mJQH9GaGDjuZJ';

// Initialize Mistral client
const mistralClient = new Mistral({
  apiKey: MISTRAL_API_KEY
});

// Test document
const testDocument = `This is a test document. 
It contains some gramar errors and mispellings.
The formating is inconsistent.
There are style issues that could be improved.
This sentece is missing a word.`;

// Test function
async function testMistralAPI() {
  console.log('Testing Mistral API with key:', MISTRAL_API_KEY);
  console.log('Test document:', testDocument);
  
  try {
    const prompt = `
      Analyze the following text. Return only a valid JSON response in this format:
      {
        "grammar_issues": 3,
        "formatting_issues": 1,
        "style_issues": 1,
        "score": 75,
        "readability_score": "Fair",
        "suggestions": [
          {
            "type": "grammar",
            "severity": "medium",
            "issue": "Misspelling of 'grammar'",
            "line": 2,
            "original_text": "gramar",
            "suggestion": "grammar",
            "explanation": "The word is spelled incorrectly."
          }
        ]
      }
      
      Provide an analysis of this text:
      ${testDocument}
    `;

    console.log('Sending request to Mistral API...');
    const response = await mistralClient.chat.complete({
      model: 'mistral-small',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      maxTokens: 2048
    });

    // Extract the response content
    const content = response.choices[0].message.content;
    console.log('Received raw response from Mistral API:');
    console.log('-'.repeat(50));
    console.log(content);
    console.log('-'.repeat(50));
    
    try {
      // First, try direct parsing
      const result = JSON.parse(content);
      console.log('Successfully parsed JSON directly!');
      console.log('API is working correctly!');
      return;
    } catch (parseError) {
      console.log('Could not parse directly, trying to extract JSON from text...');
    }
    
    // Try to extract JSON from markdown code blocks or anywhere in the text
    let jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (!jsonMatch) {
      // Try to find JSON without code blocks
      jsonMatch = content.match(/(\{[\s\S]*?\})/);
    }
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const jsonStr = jsonMatch[1].trim();
        console.log('Extracted JSON string:');
        console.log(jsonStr);
        
        const analysisResult = JSON.parse(jsonStr);
        console.log('Successfully parsed extracted JSON!');
        console.log('API is working correctly!');
      } catch (jsonError) {
        console.error('Error parsing extracted JSON:', jsonError);
        console.log('Extracted text that failed to parse:');
        console.log(jsonMatch[1]);
      }
    } else {
      console.error('Could not find JSON in the response');
    }
  } catch (error) {
    console.error('Error testing Mistral API:', error);
  }
}

// Run the test
testMistralAPI(); 