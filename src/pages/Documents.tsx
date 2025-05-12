import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Filter, Upload, Search } from "lucide-react";
import { formatFileSize } from "../utils/formatters";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { extractTextFromFile, analyzeDocument } from "@/integrations/mistral/client";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/documents/EmptyState";
import { UploadProgress } from "@/components/documents/UploadProgress";

// Maximum file size - 25MB (increased from 5MB)
const MAX_FILE_SIZE = 25 * 1024 * 1024;

export default function Documents() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch all documents for the current user
  const fetchDocuments = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const { data: documents, error } = await (supabase as any)
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(documents || []);
    } catch (error: any) {
      console.error("Error fetching documents:", error.message);
      toast({
        title: "Error",
        description: "Failed to fetch documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

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
    fileInput.accept = '.txt,.md,.html,.json,.pdf,.doc,.docx';
    
    fileInput.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file) return;
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) { // 25MB limit
        toast({
          title: "File too large",
          description: `Maximum file size is ${formatFileSize(MAX_FILE_SIZE)}. Please upload a smaller file.`,
          variant: "destructive"
        });
        return;
      }
      
      // Show different warnings based on file type
      if (file.type === 'application/pdf') {
        toast({
          title: "PDF Detected",
          description: "We will attempt to extract text from your PDF. For best results with image-based PDFs, consider extracting text manually.",
          variant: "default"
        });
      } else if (file.type === 'application/msword' || 
                 file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        toast({
          title: "Word Document Detected",
          description: "Word documents cannot be fully processed in the browser. Consider converting to plain text for better results.",
          variant: "default"
        });
      } else if (!['text/plain', 'text/markdown', 'text/html', 'application/json'].includes(file.type)) {
        toast({
          title: "Warning",
          description: "For best results, upload plain text files (.txt, .md). Other file types may not be analyzed properly.",
          variant: "default"
        });
      }
      
      try {
        setUploading(true);
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
        
        // Extract text from the file with better error handling
        console.log(`Processing file: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
        let fileText;
        
        try {
          fileText = await extractTextFromFile(file);
          console.log(`Successfully extracted text: ${fileText.length} characters`);
          
          // Check if we received an error message instead of actual text content
          if (fileText.startsWith('Failed to extract text from PDF') || 
              fileText.includes('PDF TEXT EXTRACTION LIMITATION') ||
              fileText.includes('cannot be processed directly')) {
            toast({
              title: "PDF Processing Limited",
              description: "Your PDF appears to be image-based or protected, which limits text extraction. We'll still try to analyze it.",
              variant: "default"
            });
          }
          
          // Check for specific messages after extracting text
          if (fileText.includes("PDF extraction feature is currently experiencing technical difficulties") ||
              fileText.includes("PDF TEXT EXTRACTION LIMITATION")) {
            // This is the fallback message for PDF files
            toast({
              title: "PDF Processing",
              description: "We're analyzing the PDF with limited capabilities. For best results, extract text manually and upload as a .txt file.",
              variant: "default"
            });
          } else if (fileText.includes("cannot be fully parsed in the browser")) {
            // This is the message for Word documents
            toast({
              title: "Limited Processing",
              description: "This file type has limited support. Analysis results may be incomplete.",
              variant: "default"
            });
          }
        } catch (extractError) {
          console.error("Text extraction failed:", extractError);
          toast({
            title: "File Processing Error",
            description: extractError.message || "Failed to extract text from file",
            variant: "destructive"
          });
          clearInterval(progressInterval);
          setUploadProgress(0);
          setUploading(false);
          return;
        }
        
        // Create document record in 'analyzing' state
        const { data: newDoc, error: insertError } = await (supabase as any)
          .from('documents')
          .insert({
            user_id: user.id,
            name: file.name,
            type: file.type,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            status: 'Analyzing',
            progress: 0,
            content: fileText,
            created_at: new Date().toISOString()
          })
          .select()
          .single();
          
        if (insertError) throw insertError;
        
        const documentId = newDoc.id;
        
        // Add the document to the state
        const newDocumentState: any = {
          id: documentId,
          name: file.name,
          type: file.type,
          size: `${(file.size / 1024).toFixed(2)} KB`,
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
            await (supabase as any)
              .from('documents')
              .update({ progress: 50 })
              .eq('id', documentId);
              
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === documentId 
                  ? { ...doc, progress: 50 } as any
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
            
            await (supabase as any)
              .from('documents')
              .update(updatedDoc)
              .eq('id', documentId);
              
            // Save suggestions to the database
            if (analysis.suggestions && analysis.suggestions.length > 0) {
              // Format suggestions for database storage
              const suggestionsData = analysis.suggestions.map(suggestion => ({
                document_id: documentId,
                type: suggestion.type,
                severity: suggestion.severity,
                issue: suggestion.issue,
                suggestion: suggestion.suggestion,
                explanation: suggestion.explanation,
                created_at: new Date().toISOString()
              }));
              
              // Log for debugging
              console.log(`Saving ${suggestionsData.length} suggestions to database`);
              
              // Use batch insert or multiple inserts if there are many suggestions
              if (suggestionsData.length > 10) {
                // Insert in batches of 10 to avoid potential size limitations
                for (let i = 0; i < suggestionsData.length; i += 10) {
                  const batch = suggestionsData.slice(i, i + 10);
                  await (supabase as any)
                    .from('document_suggestions')
                    .insert(batch);
                }
              } else {
                // Insert all at once if fewer than 10 suggestions
                await (supabase as any)
                  .from('document_suggestions')
                  .insert(suggestionsData);
              }
            }
            
            // Update local state
            setDocuments(prev => 
              prev.map(doc => 
                doc.id === documentId 
                  ? { 
                      id: documentId,
                      name: file.name,
                      type: file.type,
                      size: `${(file.size / 1024).toFixed(2)} KB`,
                      date: new Date().toLocaleDateString(),
                      status: 'Analyzed',
                      score: analysis.score,
                      grammar_issues: analysis.grammar_issues,
                      formatting_issues: analysis.formatting_issues,
                      style_issues: analysis.style_issues,
                      readability_score: analysis.readability_score
                    } as any
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
            await (supabase as any)
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
                      type: file.type,
                      size: `${(file.size / 1024).toFixed(2)} KB`,
                      date: new Date().toLocaleDateString(),
                      status: 'Failed',
                      error: 'Failed to analyze document'
                    } as any
                  : doc
              )
            );
            
            toast({
              title: "Analysis failed",
              description: "Failed to analyze your document",
              variant: "destructive"
            });
          } finally {
            setUploading(false);
          }
        }, 1000);
        
      } catch (error: any) {
        console.error("Error uploading document:", error);
        setUploading(false);
        toast({
          title: "Upload failed",
          description: "Failed to upload your document",
          variant: "destructive"
        });
      }
    };

    fileInput.click();
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await (supabase as any)
        .from("documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;

      // Update documents list
      setDocuments(documents.filter((doc: any) => doc.id !== documentId));

      toast({
        title: "Document Deleted",
        description: "The document has been deleted successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
        title: "Deletion Failed",
        description: error.message || "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
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
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>
      
      <UploadProgress isUploading={uploading} uploadProgress={uploadProgress} />
      
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onUpload={handleUpload} />
        ) : (
          <DocumentsTable 
            documents={filteredDocuments} 
            onViewDocument={(documentId) => navigate(`/dashboard/errors-solution?document=${documentId}`)}
            onDeleteDocument={handleDeleteDocument}
          />
        )}
      </Card>

      {/* File Support Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">File Support Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Supported File Types</h3>
              <p className="text-sm text-muted-foreground mt-1">
                For the best analysis results, we recommend uploading these file types:
              </p>
              <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                <li><span className="font-medium">Plain Text (.txt)</span> - Fully supported, best results</li>
                <li><span className="font-medium">Markdown (.md)</span> - Fully supported</li>
                <li><span className="font-medium">HTML (.html)</span> - Supported with formatting limitations</li>
                <li><span className="font-medium">JSON (.json)</span> - Supported</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold">Limited Support</h3>
              <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                <li>
                  <span className="font-medium">PDF (.pdf)</span> - 
                  <span className="text-amber-600"> Limited support</span>. 
                  We recommend extracting text from PDFs manually for the best results.
                </li>
                <li>
                  <span className="font-medium">Word Documents (.doc, .docx)</span> - 
                  <span className="text-amber-600"> Very limited support</span>. 
                  Consider converting to plain text first.
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-800">PDF Handling Tips</h3>
              <p className="text-sm text-blue-800 mt-1">
                To get the best analysis for PDF files:
              </p>
              <ol className="text-sm list-decimal pl-5 mt-2 space-y-1 text-blue-800">
                <li>Open your PDF in any PDF viewer (like Adobe Reader)</li>
                <li>Select all text (Ctrl+A or Cmd+A)</li>
                <li>Copy the text (Ctrl+C or Cmd+C)</li>
                <li>Create a new .txt file and paste the content</li>
                <li>Upload the .txt file for analysis</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 