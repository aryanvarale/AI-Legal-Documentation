import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DocumentType } from "@/types/document";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { EmptyState } from "@/components/documents/EmptyState";
import { UploadProgress } from "@/components/documents/UploadProgress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeDocument, extractTextFromFile } from "@/integrations/mistral/client";
import { useNavigate } from "react-router-dom";

const Documents = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch documents when component mounts
  useEffect(() => {
    if (user) {
      fetchUserDocuments();
    }
  }, [user]);

  const fetchUserDocuments = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Transform database results to DocumentType
      if (data) {
        const transformedDocs: DocumentType[] = data.map(doc => {
          if (doc.status === 'Analyzed') {
            return {
              id: doc.id,
              name: doc.name,
              type: doc.type,
              size: doc.size,
              status: doc.status,
              date: new Date(doc.created_at).toLocaleDateString(),
              score: doc.score,
              grammar_issues: doc.grammar_issues,
              formatting_issues: doc.formatting_issues,
              style_issues: doc.style_issues,
              readability_score: doc.readability_score
            };
          } else if (doc.status === 'Analyzing') {
            return {
              id: doc.id,
              name: doc.name,
              type: doc.type,
              size: doc.size,
              status: doc.status,
              date: new Date(doc.created_at).toLocaleDateString(),
              progress: doc.progress || 0
            };
          } else {
            return {
              id: doc.id,
              name: doc.name,
              type: doc.type,
              size: doc.size,
              status: 'Failed',
              date: new Date(doc.created_at).toLocaleDateString(),
              error: doc.error || 'Unknown error'
            };
          }
        });
        
        setDocuments(transformedDocs);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to load your documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpload = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to upload documents",
        variant: "destructive"
      });
      return;
    }
    
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.txt,.md,.doc,.docx,.pdf';
    
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      try {
        setIsUploading(true);
        setUploadProgress(0);
        
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 300);
        
        // Extract text from the file
        const fileText = await extractTextFromFile(file);
        
        // Create document record in 'analyzing' state
        const newDoc = {
          user_id: user.id,
          name: file.name,
          type: file.type || file.name.split('.').pop()?.toUpperCase() || 'TXT',
          size: `${(file.size / 1024).toFixed(2)} KB`,
          status: 'Analyzing',
          progress: 0,
          content: fileText,
          created_at: new Date().toISOString()
        };
        
        const { data: docData, error: docError } = await supabase
          .from('documents')
          .insert(newDoc)
          .select();
          
        if (docError) throw docError;
        
        const documentId = docData[0].id;
        
        // Add the document to the state
        const newDocumentState: DocumentType = {
          id: documentId,
          name: file.name,
          type: newDoc.type,
          size: newDoc.size,
          date: new Date().toLocaleDateString(),
          status: 'Analyzing',
          progress: 0
        };
        
        setDocuments(prev => [newDocumentState, ...prev]);
        
        // Complete the upload progress
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Start analysis with Mistral API
        setTimeout(async () => {
          try {
            // Update document progress
            await supabase
              .from('documents')
              .update({ progress: 50 })
              .eq('id', documentId);
              
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === documentId 
                  ? { ...doc, progress: 50 } as DocumentType
                  : doc
              )
            );
            
            // Analyze document with Mistral API
            const analysis = await analyzeDocument(fileText);
            
            // Update document with analysis results
            const updatedDoc = {
              status: 'Analyzed',
              score: analysis.score,
              grammar_issues: analysis.grammar_issues,
              formatting_issues: analysis.formatting_issues,
              style_issues: analysis.style_issues,
              readability_score: analysis.readability_score,
              progress: 100
            };
            
            await supabase
              .from('documents')
              .update(updatedDoc)
              .eq('id', documentId);
              
            // Save suggestions to the database
            if (analysis.suggestions && analysis.suggestions.length > 0) {
              const suggestionsData = analysis.suggestions.map(suggestion => ({
                document_id: documentId,
                type: suggestion.type,
                severity: suggestion.severity,
                issue: suggestion.issue,
                suggestion: suggestion.suggestion,
                explanation: suggestion.explanation
              }));
              
              await supabase
                .from('document_suggestions')
                .insert(suggestionsData);
            }
            
            // Update local state
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === documentId 
                  ? { 
                      id: documentId,
                      name: file.name,
                      type: newDoc.type,
                      size: newDoc.size,
                      date: new Date().toLocaleDateString(),
                      status: 'Analyzed',
                      score: analysis.score,
                      grammar_issues: analysis.grammar_issues,
                      formatting_issues: analysis.formatting_issues,
                      style_issues: analysis.style_issues,
                      readability_score: analysis.readability_score
                    } as DocumentType
                  : doc
              )
            );
            
            toast({
              title: "Analysis complete",
              description: "Your document has been analyzed successfully"
            });
          } catch (error) {
            console.error("Error analyzing document:", error);
            
            // Update document as failed
            await supabase
              .from('documents')
              .update({ 
                status: 'Failed',
                error: 'Failed to analyze document'
              })
              .eq('id', documentId);
              
            // Update local state
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === documentId 
                  ? { 
                      id: documentId,
                      name: file.name,
                      type: newDoc.type,
                      size: newDoc.size,
                      date: new Date().toLocaleDateString(),
                      status: 'Failed',
                      error: 'Failed to analyze document'
                    } as DocumentType
                  : doc
              )
            );
            
            toast({
              title: "Analysis failed",
              description: "Failed to analyze your document",
              variant: "destructive"
            });
          } finally {
            setIsUploading(false);
          }
        }, 1000);
        
      } catch (error) {
        console.error("Error uploading document:", error);
        setIsUploading(false);
        toast({
          title: "Upload failed",
          description: "Failed to upload your document",
          variant: "destructive"
        });
      }
    };
    
    fileInput.click();
  };
  
  const handleViewDocument = (id: string) => {
    navigate(`/dashboard/errors-solution?document=${id}`);
  };
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search documents..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={handleUpload}
            className="whitespace-nowrap bg-brand-purple hover:bg-brand-purple/90"
            disabled={isUploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
      
      <UploadProgress isUploading={isUploading} uploadProgress={uploadProgress} />
      
      <Card>
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onUpload={handleUpload} />
        ) : (
          <DocumentsTable documents={filteredDocuments} onViewDocument={handleViewDocument} />
        )}
      </Card>
    </div>
  );
};

export default Documents; 