// Document type definitions
export type BaseDocument = {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
  status: string;
};

export type Suggestion = {
  id?: string;
  document_id: string;
  type: 'grammar' | 'formatting' | 'style';
  severity: 'low' | 'medium' | 'high';
  issue: string;
  suggestion: string;
  explanation: string;
  created_at?: string;
};

export type AnalyzedDocument = BaseDocument & {
  status: 'Analyzed';
  score: number;
  grammar_issues: number;
  formatting_issues: number;
  style_issues: number;
  readability_score: string;
  suggestions?: Suggestion[];
  progress?: never;
  error?: never;
};

export type AnalyzingDocument = BaseDocument & {
  status: 'Analyzing';
  progress: number;
  score?: never;
  grammar_issues?: never;
  formatting_issues?: never;
  style_issues?: never;
  readability_score?: never;
  suggestions?: never;
  error?: never;
};

export type FailedDocument = BaseDocument & {
  status: 'Failed';
  error: string;
  progress?: never;
  score?: never;
  grammar_issues?: never;
  formatting_issues?: never;
  style_issues?: never;
  readability_score?: never;
  suggestions?: never;
};

export type DocumentType = AnalyzedDocument | AnalyzingDocument | FailedDocument;

// Removed mock documents - we'll fetch real data from the database
