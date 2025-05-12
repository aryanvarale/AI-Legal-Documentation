// Mistral API client for document analysis
import { Mistral } from '@mistralai/mistralai';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js with more robust worker setup
try {
  // For browser environments, use the copied worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
} catch (e) {
  console.warn("Could not set PDF.js worker URL:", e);
  // Fallback to CDN if the local worker fails
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY || 'jRuxrXPaXaoCLMEarL3mJQH9GaGDjuZJ';

// Initialize Mistral client
const mistralClient = new Mistral({
  apiKey: MISTRAL_API_KEY
});

export interface MistralAnalysisResult {
  grammar_issues: number;
  formatting_issues: number;
  style_issues: number;
  score: number;
  readability_score: string;
  suggestions: Suggestion[];
}

export interface Suggestion {
  type: 'grammar' | 'formatting' | 'style';
  severity: 'low' | 'medium' | 'high';
  issue: string;
  suggestion: string;
  explanation: string;
}

// Enhanced function to extract text from a PDF file
const extractTextFromPDF = async (fileArrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    console.log('Starting PDF extraction process...');
    
    // Load the PDF document with optimized options
    const loadingTask = pdfjsLib.getDocument({ 
      data: fileArrayBuffer,
      disableFontFace: true, // Disable font loading for better reliability
      cMapUrl: null,         // Disable character maps
      standardFontDataUrl: null, // Disable standard font loading
    });
    console.log('PDF loading task created');
    
    // Enable the progress callback - helpful for debugging
    loadingTask.onProgress = (progressData: {loaded: number, total: number}) => {
      console.log(`PDF loading progress: ${(progressData.loaded / progressData.total * 100).toFixed(2)}%`);
    };
    
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    
    let text = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      text += pageText + '\n\n';
    }
    
    console.log(`PDF extraction complete. Extracted ${text.length} characters`);
    
    // Basic validation to see if we got meaningful text
    if (text.trim().length < 10) {
      throw new Error('Extracted text is too short or empty - PDF may be image-based or protected');
    }
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return `Failed to extract text from PDF. Error: ${error?.message || 'Unknown error'}`;
  }
};

export const analyzeDocument = async (text: string): Promise<MistralAnalysisResult> => {
  try {
    // Add input validation and preprocessing
    if (!text || typeof text !== 'string') {
      throw new Error('Invalid input: text must be a non-empty string');
    }
    
    // Clean and prepare the text
    const cleanText = text.trim();
    if (cleanText.length === 0) {
      throw new Error('Empty document: the text contains no meaningful content to analyze');
    }
    
    // Check if the text is actually an error message from file extraction
    if (cleanText.includes("Failed to extract text from PDF") ||
        cleanText.includes("PDF TEXT EXTRACTION LIMITATION") ||
        cleanText.includes("cannot be fully parsed in the browser")) {
      // This is not a real document but a message about file handling limitations
      return {
        grammar_issues: 0,
        formatting_issues: 0,
        style_issues: 0,
        score: 50,
        readability_score: 'Fair',
        suggestions: [
          {
            type: 'formatting',
            severity: 'medium',
            issue: 'PDF extraction issue detected',
            suggestion: 'Extract the text from your PDF manually and try again',
            explanation: 'Your PDF appears to be image-based or has limited text content that can be extracted by the browser'
          }
        ]
      };
    }
    
    // Split the text into lines for line-specific analysis
    const lines = cleanText.split('\n');
    const lineCount = lines.length;
    
    // Simplified and more direct prompt to get proper JSON response
    const prompt = `
      You are a professional document analyzer. I need you to analyze this text and return ONLY a valid JSON object.

      Document Information:
      - Total lines: ${lineCount}
      
      Analyze this text for:
      1. Grammar issues (spelling, punctuation, grammar)
      2. Formatting issues (capitalization, spacing, indentation)
      3. Style issues (word choice, sentence structure)
      
      Return your analysis as a JSON object with these exact fields:
      {
        "grammar_issues": number,
        "formatting_issues": number,
        "style_issues": number,
        "score": number (0-100 quality score),
        "readability_score": string (Poor, Fair, Good, Very Good, or Excellent),
        "suggestions": [
          {
            "type": string (grammar, formatting, or style),
            "severity": string (low, medium, high),
            "issue": string (brief description),
            "line": number (line number),
            "original_text": string (the problematic text),
            "suggestion": string (corrected text),
            "explanation": string (why this needs correction)
          }
        ]
      }
      
      CRITICAL: Return ONLY the JSON with no additional text or explanation.
      Do not wrap the JSON in code blocks or markdown.
      
      Text to analyze:
      ${cleanText}
    `;

    console.log('Sending analysis request to Mistral API...');
    
    const response = await mistralClient.chat.complete({
      model: 'mistral-small',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.1, // Lower temperature for more consistent responses
      maxTokens: 2048
    });

    // Extract the JSON from the response
    const content = response.choices[0].message.content;
    if (!content || typeof content !== 'string') {
      throw new Error('Empty or invalid response from API');
    }
    
    console.log('Received Mistral API response, parsing JSON...');
    
    // Attempt to parse the response as JSON directly first
    try {
      const analysisResult = JSON.parse(content);
      
      // Process the suggestions to ensure they match our interface
      analysisResult.suggestions = analysisResult.suggestions.map((suggestion: any) => ({
        type: suggestion.type,
        severity: suggestion.severity,
        issue: suggestion.line ? `Line ${suggestion.line}: ${suggestion.issue}` : suggestion.issue,
        suggestion: suggestion.suggestion,
        explanation: suggestion.original_text 
          ? `Original text: "${suggestion.original_text}". ${suggestion.explanation}`
          : suggestion.explanation
      }));
      
      return analysisResult;
    } catch (parseError) {
      console.error('Could not parse response directly:', parseError);
      
      // Attempt to extract JSON from markdown code blocks or anywhere in text
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/) || content.match(/(\{[\s\S]*?\})/);
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          const jsonStr = jsonMatch[1].trim();
          const analysisResult = JSON.parse(jsonStr);
          
          // Process the suggestions to ensure they match our interface
          analysisResult.suggestions = analysisResult.suggestions.map((suggestion: any) => ({
            type: suggestion.type,
            severity: suggestion.severity,
            issue: suggestion.line ? `Line ${suggestion.line}: ${suggestion.issue}` : suggestion.issue,
            suggestion: suggestion.suggestion,
            explanation: suggestion.original_text 
              ? `Original text: "${suggestion.original_text}". ${suggestion.explanation}`
              : suggestion.explanation
          }));
          
          return analysisResult;
        } catch (extractError) {
          console.error('Failed to parse extracted JSON:', extractError);
          throw new Error('Unable to parse JSON from API response');
        }
      } else {
        throw new Error('Unable to find valid JSON in API response');
      }
    }
  } catch (error) {
    console.error('Error analyzing document with Mistral API:', error);
    // Return default values if analysis fails
    return {
      grammar_issues: 0,
      formatting_issues: 0,
      style_issues: 0,
      score: 70,
      readability_score: 'Fair',
      suggestions: [
        {
          type: 'grammar',
          severity: 'medium',
          issue: 'Failed to perform document analysis',
          suggestion: 'Please try again later',
          explanation: 'The AI service is currently unavailable. Please check your API key and try again.'
        }
      ]
    };
  }
};

// Enhanced fallback PDF extraction with more helpful messages
const extractPDFWithFallback = async (file: File): Promise<string> => {
  // Create a detailed message with metadata from the PDF and helpful instructions
  return `
=== PDF TEXT EXTRACTION LIMITATION ===

We detected that the PDF file "${file.name}" (${(file.size / 1024).toFixed(2)} KB) 
may be image-based or have limited text content.

For better results:
1. Use an OCR (Optical Character Recognition) tool to convert your PDF to text
2. Copy the text manually from your PDF viewer:
   - Open the PDF in Adobe Reader or another PDF viewer
   - Select all text (Ctrl+A or Cmd+A)
   - Copy the text (Ctrl+C or Cmd+C)
   - Paste it into a text file (.txt)
   - Upload the text file for analysis

3. Use a different PDF that contains selectable text

Image-based PDFs contain pictures of text rather than actual text characters,
making them difficult to analyze directly.

=== END OF NOTICE ===
`;
};

// Function to extract text from file with improved PDF handling
export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    console.log(`Extracting text from file: ${file.name} (${file.type}), size: ${file.size} bytes`);
    
    // Simple text file types
    const textFileTypes = [
      'text/plain',
      'text/markdown',
      'text/html',
      'application/json'
    ];
    
    // PDF file type
    const isPDF = file.type === 'application/pdf';
    
    // DOC file types
    const isDoc = file.type === 'application/msword' || 
                  file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (isPDF) {
      console.log('Processing PDF file...');
      try {
        // Try to extract text from PDF
        file.arrayBuffer().then(buffer => {
          extractTextFromPDF(buffer)
            .then(text => {
              // Check if PDF extraction was successful
              if (text.startsWith('Failed to extract text from PDF')) {
                console.log('PDF extraction failed, using fallback...');
                extractPDFWithFallback(file).then(resolve).catch(reject);
              } else if (text.trim().length < 50) {
                // If we got very little text, it's probably an image-based PDF
                console.log('PDF appears to be image-based, using fallback...');
                extractPDFWithFallback(file).then(resolve).catch(reject);
              } else {
                // We got text, resolve with it
                console.log(`PDF extraction succeeded with ${text.length} characters`);
                resolve(text);
              }
            })
            .catch(error => {
              console.error('PDF extraction error, using fallback:', error);
              extractPDFWithFallback(file).then(resolve).catch(reject);
            });
        }).catch(error => {
          console.error('Error reading PDF file as array buffer:', error);
          extractPDFWithFallback(file).then(resolve).catch(reject);
        });
      } catch (error) {
        console.error('Error in PDF processing:', error);
        extractPDFWithFallback(file).then(resolve).catch(reject);
      }
    } else if (isDoc) {
      // For Word documents, we can't process them directly in the browser
      // Just return a message indicating it's a Word document
      console.log('Word document detected, returning placeholder message');
      resolve(`This is a Word document (${file.name}) which cannot be fully parsed in the browser. ` +
              `Please convert to PDF or plain text for better analysis.`);
    } else if (textFileTypes.includes(file.type)) {
      // Handle text files
      console.log('Processing text file...');
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const text = event.target.result.toString();
          console.log(`Text file loaded with ${text.length} characters`);
          resolve(text);
        } else {
          const errorMsg = 'Failed to read text file: No data received from file reader';
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      
      reader.onerror = (event) => {
        const errorMsg = `Text file reading failed: ${event.target?.error?.message || 'Unknown error'}`;
        console.error(errorMsg);
        reject(new Error(errorMsg));
      };
      
      reader.readAsText(file);
    } else {
      // Unknown file type - attempt to read as text
      console.log('Unknown file type, attempting to read as text...');
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          if (typeof event.target.result === 'string') {
            console.log(`File contents read as text with ${event.target.result.length} characters`);
            resolve(event.target.result);
          } else {
            const message = `This file type (${file.name}) cannot be processed directly. ` +
                           `Please convert to PDF, TXT, or another supported format.`;
            console.log('Returning error message for unsupported file type');
            resolve(message);
          }
        } else {
          const errorMsg = 'Failed to read file: No data received from file reader';
          console.error(errorMsg);
          reject(new Error(errorMsg));
        }
      };
      
      reader.onerror = (event) => {
        const errorMsg = `File reading failed: ${event.target?.error?.message || 'Unknown error'}`;
        console.error(errorMsg);
        reject(new Error(errorMsg));
      };
      
      reader.readAsText(file);
    }
  });
}; 