// Test script for local PDF extraction
const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;

// Function to extract text from a local PDF file
const extractTextFromLocalPDF = async (filePath) => {
  try {
    console.log(`Starting PDF extraction from local file: ${filePath}`);
    
    // Read the file
    const data = fs.readFileSync(filePath);
    // Convert Buffer to ArrayBuffer
    const arrayBuffer = new Uint8Array(data).buffer;
    console.log(`PDF loaded, size: ${arrayBuffer.byteLength} bytes`);
    
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

// Get the file path from command line argument
const pdfFilePath = process.argv[2];

if (!pdfFilePath) {
  console.error('Please provide a path to a PDF file');
  process.exit(1);
}

console.log('Starting PDF extraction test...');
extractTextFromLocalPDF(pdfFilePath)
  .then(text => {
    console.log('Test completed!');
    if (text.startsWith('Failed to extract')) {
      console.error('Test failed:', text);
    } else {
      console.log(`Extracted ${text.length} characters from the PDF.`);
      // Write extracted text to a file for inspection
      fs.writeFileSync('extracted-text.txt', text);
      console.log('Extracted text saved to extracted-text.txt');
    }
  })
  .catch(error => {
    console.error('Test failed with error:', error);
  }); 