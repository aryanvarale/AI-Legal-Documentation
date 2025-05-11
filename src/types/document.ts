
// Document type definitions
export type BaseDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  status: string;
};

export type AnalyzedDocument = BaseDocument & {
  status: 'Analyzed';
  score: number;
  issues: number;
  progress?: never;
  error?: never;
};

export type AnalyzingDocument = BaseDocument & {
  status: 'Analyzing';
  progress: number;
  score?: never;
  issues?: never;
  error?: never;
};

export type FailedDocument = BaseDocument & {
  status: 'Failed';
  error: string;
  progress?: never;
  score?: never;
  issues?: never;
};

export type DocumentType = AnalyzedDocument | AnalyzingDocument | FailedDocument;

// Mock documents data
export const mockDocuments: DocumentType[] = [
  {
    id: '1',
    name: 'Business Proposal.docx',
    type: 'DOCX',
    size: '1.2 MB',
    status: 'Analyzed',
    score: 85,
    issues: 7,
    date: '2025-05-01',
  },
  {
    id: '2',
    name: 'Meeting Notes.pdf',
    type: 'PDF',
    size: '458 KB',
    status: 'Analyzing',
    progress: 65,
    date: '2025-05-09',
  },
  {
    id: '3',
    name: 'Product Roadmap.docx',
    type: 'DOCX',
    size: '2.4 MB',
    status: 'Analyzed',
    score: 92,
    issues: 3,
    date: '2025-05-08',
  },
  {
    id: '4',
    name: 'Financial Report Q1.pdf',
    type: 'PDF',
    size: '3.8 MB',
    status: 'Analyzed',
    score: 78,
    issues: 12,
    date: '2025-04-15',
  },
  {
    id: '5',
    name: 'Employee Handbook.pdf',
    type: 'PDF',
    size: '5.2 MB',
    status: 'Failed',
    error: 'Format not supported',
    date: '2025-04-10',
  },
];
