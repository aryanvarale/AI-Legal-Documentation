import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Check, Upload, FileText, ChevronDown, ChevronUp, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suggestion } from "@/types/document";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Define interfaces for the document analytics
interface DocumentAnalytics {
  id: string;
  user_id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  score?: number;
  grammar_issues?: number;
  formatting_issues?: number;
  style_issues?: number;
  readability_score?: string;
  progress?: number;
  error?: string;
  content?: string;
  created_at: string;
}

const ErrorsSolution = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [document, setDocument] = useState<DocumentAnalytics | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");

  useEffect(() => {
    if (user) {
      const searchParams = new URLSearchParams(location.search);
      const documentId = searchParams.get('document');
      
      if (documentId) {
        fetchDocumentDetails(documentId);
      } else {
        setIsLoading(false);
      }
    }
  }, [user, location]);

  const fetchDocumentDetails = async (documentId: string) => {
    try {
      setIsLoading(true);
      
      // Fetch document
      const { data: docData, error: docError } = await (supabase as any)
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (docError) {
        console.error("Document fetch error:", docError);
        // If the table doesn't exist, handle gracefully
        if (docError.code === '42P01') {
          toast.error("Database setup required. Please run the SQL setup script in the Supabase dashboard.");
          setDocument(null);
          setSuggestions([]);
          return;
        } else {
          throw docError;
        }
      }
      
      if (docData) {
        setDocument(docData as DocumentAnalytics);
        
        try {
          // Fetch suggestions
          const { data: suggestionsData, error: suggestionsError } = await (supabase as any)
            .from('document_suggestions')
            .select('*')
            .eq('document_id', documentId)
            .order('severity', { ascending: false });  // Show high severity issues first
            
          if (suggestionsError) {
            console.error("Suggestions fetch error:", suggestionsError);
            // If the table doesn't exist, just use empty array
            if (suggestionsError.code === '42P01') {
              setSuggestions([]);
            } else {
              throw suggestionsError;
            }
          } else if (suggestionsData) {
            setSuggestions(suggestionsData as Suggestion[]);
            
            // If we got empty suggestions but document is analyzed, create a default one
            if (suggestionsData.length === 0 && docData.status === 'Analyzed') {
              const defaultSuggestions: Suggestion[] = [];
              
              // Add grammar issue if grammar_issues > 0
              if (docData.grammar_issues > 0) {
                defaultSuggestions.push({
                  id: 'default-grammar',
                  document_id: documentId,
                  type: 'grammar',
                  severity: 'medium',
                  issue: 'Grammar issues detected',
                  suggestion: 'Review the document for grammatical errors',
                  explanation: 'The analysis detected grammar issues that need attention',
                  created_at: new Date().toISOString()
                });
              }
              
              // Add formatting issue if formatting_issues > 0
              if (docData.formatting_issues > 0) {
                defaultSuggestions.push({
                  id: 'default-formatting',
                  document_id: documentId,
                  type: 'formatting',
                  severity: 'medium',
                  issue: 'Formatting inconsistencies found',
                  suggestion: 'Apply consistent formatting throughout the document',
                  explanation: 'The analysis detected inconsistencies in document formatting',
                  created_at: new Date().toISOString()
                });
              }
              
              // Add style issue if style_issues > 0
              if (docData.style_issues > 0) {
                defaultSuggestions.push({
                  id: 'default-style',
                  document_id: documentId,
                  type: 'style',
                  severity: 'medium',
                  issue: 'Style improvements recommended',
                  suggestion: 'Review the document for style and clarity',
                  explanation: 'The analysis detected opportunities to improve the writing style',
                  created_at: new Date().toISOString()
                });
              }
              
              // If no issues were found but score is less than 100, add general suggestion
              if (defaultSuggestions.length === 0 && docData.score < 100) {
                defaultSuggestions.push({
                  id: 'default-general',
                  document_id: documentId,
                  type: 'style',
                  severity: 'low',
                  issue: 'Minor improvements possible',
                  suggestion: 'Review the document for clarity and conciseness',
                  explanation: 'The document is good overall but could benefit from a final review',
                  created_at: new Date().toISOString()
                });
              }
              
              setSuggestions(defaultSuggestions);
            }
          }
        } catch (suggestionsErr) {
          console.error("Error fetching suggestions:", suggestionsErr);
          setSuggestions([]);
          toast.error("Failed to load document suggestions");
        }
      }
    } catch (error) {
      console.error("Error fetching document details:", error);
      toast.error("Failed to load document details");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Analyzed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Analyzing':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'Failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpload = () => {
    navigate('/dashboard/documents');
  };

  const filteredSuggestions = activeTab === "all" 
    ? suggestions 
    : suggestions.filter(sugg => sugg.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <h1 className="text-2xl font-bold">Error Analysis & Suggestions</h1>
        <Button onClick={handleUpload} className="bg-brand-purple hover:bg-brand-purple/90 mt-2 sm:mt-0">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document for Analysis
        </Button>
      </div>
      
      {isLoading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mb-4"></div>
            <p className="text-muted-foreground">Loading document analysis...</p>
          </div>
        </Card>
      ) : !document ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-amber-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Document Selected</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Please select a document from your documents list or upload a new document for analysis.
            </p>
            <Button onClick={handleUpload}>Upload New Document</Button>
          </div>
        </Card>
      ) : document.status === 'Analyzing' ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Analysis in Progress</h2>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              We're currently analyzing your document. This process may take a few moments.
            </p>
            <Progress value={document.progress || 50} className="w-64 h-2" />
            <p className="text-sm text-muted-foreground mt-2">{document.progress || 50}% complete</p>
          </div>
        </Card>
      ) : document.status === 'Failed' ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Analysis Failed</h2>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {document.error || "There was an error analyzing your document. Please try uploading it again."}
            </p>
            <Button onClick={handleUpload}>Upload New Document</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Document Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Document Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-gray-100 p-3 rounded">
                      <FileText className="h-8 w-8 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{document.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>{document.size}</span>
                        <span>•</span>
                        <span>{document.type}</span>
                        <span>•</span>
                        <span>{new Date(document.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {getStatusIcon(document.status)}
                        <span className="font-medium capitalize">{document.status}</span>
                        {document.status === 'Analyzed' && (
                          <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${document.score && document.score >= 80 ? 'bg-green-500' : document.score && document.score >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}>
                            Score: {document.score}/100
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Grammar Issues</h4>
                      <div className="text-2xl font-bold text-red-500">{document.grammar_issues || 0}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Formatting Issues</h4>
                      <div className="text-2xl font-bold text-amber-500">{document.formatting_issues || 0}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Style Issues</h4>
                      <div className="text-2xl font-bold text-blue-500">{document.style_issues || 0}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Readability</h4>
                      <div className="text-2xl font-bold text-green-500">{document.readability_score || "N/A"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Improvement Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">
                    All Issues ({suggestions.length})
                  </TabsTrigger>
                  <TabsTrigger value="grammar">
                    Grammar ({suggestions.filter(s => s.type === 'grammar').length})
                  </TabsTrigger>
                  <TabsTrigger value="formatting">
                    Formatting ({suggestions.filter(s => s.type === 'formatting').length})
                  </TabsTrigger>
                  <TabsTrigger value="style">
                    Style ({suggestions.filter(s => s.type === 'style').length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="bg-green-100 p-3 rounded-full inline-flex mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No issues found!</h3>
                      <p className="text-muted-foreground">
                        {activeTab === "all" 
                          ? "Your document doesn't have any issues. Great job!" 
                          : `Your document doesn't have any ${activeTab} issues.`}
                      </p>
                    </div>
                  ) : (
                    <Accordion type="multiple" className="w-full">
                      {filteredSuggestions.map((suggestion, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3 text-left">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getSeverityColor(suggestion.severity)}`}>
                                {suggestion.severity}
                              </span>
                              <span className="font-medium">{suggestion.issue}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-4">
                            <div className="space-y-4">
                              {suggestion.explanation.includes("Original text:") && (
                                <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-sm">
                                  {suggestion.explanation.split('Original text: "')[1]?.split('".')[0]}
                                </div>
                              )}
                              <div className="border-l-4 border-l-brand-purple pl-4 mb-3">
                                <h4 className="font-semibold mb-1">Suggestion</h4>
                                <p className="text-md">{suggestion.suggestion}</p>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">Explanation</h4>
                                <p className="text-sm text-muted-foreground">
                                  {suggestion.explanation.includes("Original text:") 
                                    ? suggestion.explanation.split('. ').slice(1).join('. ')
                                    : suggestion.explanation}
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Document Content */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Document Content</CardTitle>
            </CardHeader>
            <CardContent>
              {document?.content ? (
                <div className="bg-gray-50 p-4 rounded-md border font-mono text-sm overflow-auto max-h-96">
                  {document.content.split('\n').map((line, index) => {
                    // Extract line numbers from suggestion issues using a regex
                    const lineNumber = index + 1;
                    const hasIssue = suggestions.some(suggestion => {
                      // Look for "Line X:" pattern in the issue text
                      const lineMatch = suggestion.issue.match(/Line\s+(\d+):/i);
                      return lineMatch && parseInt(lineMatch[1]) === lineNumber;
                    });
                    
                    return (
                      <div 
                        key={index}
                        className={`${hasIssue ? 'bg-amber-50 border-l-4 border-amber-400 pl-2' : ''} flex`}
                      >
                        <span className={`text-gray-500 w-8 inline-block text-right mr-2 ${hasIssue ? 'font-bold' : ''}`}>
                          {lineNumber}
                        </span>
                        <span className={hasIssue ? 'font-medium' : ''}>{line || ' '}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">Document content not available for display.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ErrorsSolution;
