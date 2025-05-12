import { analyzeDocument } from './integrations/mistral/client';

// Test document
const testDocument = `This is a test document. 
It contains some gramar errors and mispellings.
The formating is inconsistent.
There are style issues that could be improved.
This sentece is missing a word.`;

console.log('Testing Mistral API...');
console.log('Test document:', testDocument);

analyzeDocument(testDocument)
  .then(result => {
    console.log('Analysis completed successfully!');
    console.log('Results:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  }); 