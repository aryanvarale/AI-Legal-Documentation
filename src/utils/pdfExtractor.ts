import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker
try {
  // For browser environments, try to use the public CDN
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
} catch (error) {
  console.warn('Failed to set PDF.js worker URL:', error);
  // Fallback to CDN
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
}

/**
 * Extracts text from a PDF file
 * @param file The PDF file to extract text from
 * @returns A promise that resolves to the extracted text
 */
export const extractTextFromPDF = async (file: File): Promise<string> => {
  try {
    console.log(`Starting PDF extraction from file: ${file.name}`);
    
    // Read the file
    const arrayBuffer = await file.arrayBuffer();
    console.log(`PDF loaded, size: ${arrayBuffer.byteLength} bytes`);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    console.log('PDF loading task created');
    
    const pdf = await loadingTask.promise;
    console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
    
    let text = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(`Processing page ${i} of ${pdf.numPages}`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => (item as any).str)
        .join(' ');
      
      text += pageText + '\n\n';
    }
    
    console.log(`PDF extraction complete. Extracted ${text.length} characters`);
    
    // Basic validation to see if we got meaningful text
    if (text.trim().length < 10) {
      // Return a helpful message instead of throwing an error
      return getImageBasedPDFMessage(file);
    }
    
    return text;
  } catch (error: any) {
    console.error('Error extracting text from PDF:', error);
    // Return a helpful message instead of throwing an error
    return getImageBasedPDFMessage(file);
  }
};

/**
 * Creates a helpful message for image-based PDFs
 */
const getImageBasedPDFMessage = (file: File): string => {
  return `
=== PDF TEXT EXTRACTION LIMITATION ===

We detected that the PDF file "${file.name}" (${(file.size / 1024).toFixed(2)} KB) 
may be image-based or have limited text content.

For better results:
1. Use an OCR (Optical Character Recognition) tool to convert your PDF to text
2. Copy the text manually from your PDF viewer
3. Use a different PDF that contains selectable text

Image-based PDFs contain pictures of text rather than actual text characters,
making them difficult to analyze directly.

=== END OF NOTICE ===

`;
};

/**
 * Checks if a PDF is likely to be text-based or image-based
 * @param text The extracted text from a PDF
 * @returns An object with analysis results
 */
export const analyzePDFText = (text: string) => {
  const textLength = text.length;
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
  
  // Check if this is our error message
  if (text.includes('=== PDF TEXT EXTRACTION LIMITATION ===')) {
    return {
      textLength,
      wordCount,
      isLikelyTextBased: false,
      hasText: false,
      quality: 'none' as 'high' | 'medium' | 'low' | 'none' | 'unknown',
      isErrorMessage: true
    };
  }
  
  const results = {
    textLength,
    wordCount,
    isLikelyTextBased: textLength > 100 && wordCount > 20,
    hasText: textLength > 10,
    quality: 'unknown' as 'high' | 'medium' | 'low' | 'none' | 'unknown',
    isErrorMessage: false
  };
  
  // Determine text quality
  if (results.wordCount > 100) {
    results.quality = 'high';
  } else if (results.wordCount > 20) {
    results.quality = 'medium';
  } else if (results.hasText) {
    results.quality = 'low';
  } else {
    results.quality = 'none';
  }
  
  return results;
}; 