// Simple PDF test script (CommonJS)
const fs = require('fs');
const pdfjsLib = require('pdfjs-dist');

// Try to be explicit about worker path
try {
  const PDFJS_WORKER_PATH = require.resolve('pdfjs-dist/build/pdf.worker.js');
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_PATH;
} catch (error) {
  console.warn('Could not set worker path explicitly:', error);
  // Just continue without setting it
}

async function extractTextFromPdf(pdfPath) {
  try {
    console.log(`Reading PDF from: ${pdfPath}`);
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    
    // Loading document with minimal options
    const loadingTask = pdfjsLib.getDocument({
      data,
      disableFontFace: true,
      cMapUrl: null,
      standardFontDataUrl: null,
    });
    console.log('PDF loading task created');
    
    const pdfDocument = await loadingTask.promise;
    console.log(`PDF loaded. Number of pages: ${pdfDocument.numPages}`);
    
    let text = '';
    
    // Process each page
    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      console.log(`Processing page ${pageNumber} of ${pdfDocument.numPages}`);
      const page = await pdfDocument.getPage(pageNumber);
      const textContent = await page.getTextContent();
      
      // Extract text from page
      const pageText = textContent.items.map(item => item.str).join(' ');
      text += pageText + '\n\n';
    }
    
    return text;
  } catch (error) {
    console.error('Error processing PDF:', error);
    return `Failed to extract text: ${error.message}`;
  }
}

// Get file path from command line arguments
const pdfPath = process.argv[2];

if (!pdfPath) {
  console.error('Please provide a path to a PDF file as an argument');
  process.exit(1);
}

console.log(`Starting extraction from ${pdfPath}`);

// Extract text
extractTextFromPdf(pdfPath)
  .then(text => {
    console.log('\n--- EXTRACTION COMPLETE ---');
    console.log(`Extracted ${text.length} characters`);
    
    // Save text to file
    const outputFile = 'extracted-text.txt';
    fs.writeFileSync(outputFile, text);
    console.log(`Text saved to ${outputFile}`);
    
    // Show sample of extracted text
    console.log('\nSample of extracted text:');
    console.log('------------------------');
    console.log(text.substring(0, 500) + '...');
    console.log('------------------------');
  })
  .catch(error => {
    console.error('Extraction failed:', error);
  }); 