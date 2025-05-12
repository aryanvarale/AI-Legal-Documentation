// Test script for PDF extraction
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js 
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

// Function to extract text from a PDF file
const extractTextFromPDF = async (pdfUrl) => {
  try {
    console.log(`Starting PDF extraction from URL: ${pdfUrl}`);
    
    // Fetch the PDF
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    console.log(`PDF fetched, size: ${arrayBuffer.byteLength} bytes`);
    
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    console.log('PDF loading task created');
    
    // Enable the progress callback
    loadingTask.onProgress = (progressData) => {
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
        .map((item) => item.str)
        .join(' ');
      
      text += pageText + '\n\n';
    }
    
    console.log(`PDF extraction complete. Extracted ${text.length} characters`);
    console.log('First 500 characters:');
    console.log(text.substring(0, 500));
    
    return text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    return `Failed to extract text from PDF. Error: ${error?.message || 'Unknown error'}`;
  }
};

// Test with a sample PDF
const testPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

console.log('Starting PDF extraction test...');
extractTextFromPDF(testPdfUrl)
  .then(text => {
    console.log('Test completed successfully!');
    if (text.startsWith('Failed to extract')) {
      console.error('Test failed:', text);
    } else {
      console.log(`Extracted ${text.length} characters from the PDF.`);
    }
  })
  .catch(error => {
    console.error('Test failed with error:', error);
  }); 