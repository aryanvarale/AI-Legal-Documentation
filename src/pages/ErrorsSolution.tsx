
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Check, Upload, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ErrorsSolution = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const handleUpload = async () => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.doc,.docx,.pdf,.txt';
    
    // Handle file selection
    fileInput.onchange = async (e) => {
      if (!e.target) return;
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (!file || !user) {
        if (!user) toast("Please sign in to upload documents");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Create document analysis record
        const { data: analysisData, error: analysisError } = await supabase
          .from('document_analytics')
          .insert({
            user_id: user.id,
            document_id: Math.random().toString(36).substring(2),
            document_name: file.name,
            document_path: filePath,
            document_size: `${(file.size / 1024).toFixed(2)} KB`,
            document_type: file.type,
            status: 'Analyzing'
          })
          .select();
          
        if (analysisError) throw analysisError;
        
        // Update documents list
        if (analysisData) {
          setDocuments(prev => [...prev, analysisData[0]]);
          
          // Simulate analysis completion (this would normally be done by a background process)
          setTimeout(() => {
            simulateAnalysisCompletion(analysisData[0].id);
          }, 3000);
        }
        
        toast.success("Document uploaded successfully and is being analyzed");
      } catch (error) {
        console.error("Error uploading document:", error);
        toast.error("Failed to upload document");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Trigger file input click
    fileInput.click();
  };
  
  const simulateAnalysisCompletion = async (documentId: string) => {
    try {
      // Generate random analysis results
      const grammarIssues = Math.floor(Math.random() * 10);
      const formattingIssues = Math.floor(Math.random() * 15);
      const styleIssues = Math.floor(Math.random() * 8);
      const score = Math.floor(Math.random() * 40) + 60; // Score between 60-100
      
      const { error } = await supabase
        .from('document_analytics')
        .update({
          status: 'Completed',
          grammar_issues: grammarIssues,
          formatting_issues: formattingIssues,
          style_issues: styleIssues,
          score: score,
          readability_score: getReadabilityLabel(score)
        })
        .eq('id', documentId);
        
      if (error) throw error;
      
      // Update local state
      setDocuments(prev => prev.map(doc => 
        doc.id === documentId 
          ? { 
              ...doc, 
              status: 'Completed',
              grammar_issues: grammarIssues,
              formatting_issues: formattingIssues,
              style_issues: styleIssues,
              score: score,
              readability_score: getReadabilityLabel(score)
            } 
          : doc
      ));
      
      toast.success("Document analysis completed");
    } catch (error) {
      console.error("Error updating analysis:", error);
    }
  };
  
  const getReadabilityLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Poor";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Errors Solution</h1>
        <Button onClick={handleUpload} className="bg-brand-purple hover:bg-brand-purple/90">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document for Analysis
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Error Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing document...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">No documents to analyze</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Upload a document to see error analysis and get suggestions for improvements.
              </p>
              <Button onClick={handleUpload}>Upload Document</Button>
            </div>
          ) : (
            <div className="divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gray-100 p-2 rounded">
                        <FileText className="h-8 w-8 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.document_name}</h4>
                        <div className="text-sm text-muted-foreground mt-1">
                          {doc.document_size} • {new Date(doc.created_at).toLocaleDateString()}
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className={`text-sm font-medium ${
                            doc.status === 'Completed' 
                              ? doc.score >= 80 ? 'text-green-500' : 'text-amber-500'
                              : 'text-blue-500'
                          }`}>
                            {doc.status === 'Completed' 
                              ? `Score: ${doc.score}/100 (${doc.readability_score})` 
                              : 'Analyzing...'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {doc.status === 'Completed' && (
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    )}
                  </div>
                  
                  {doc.status === 'Analyzing' && (
                    <div className="mt-4">
                      <Progress value={45} className="h-2" />
                    </div>
                  )}
                  
                  {doc.status === 'Completed' && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium">Grammar Issues</div>
                        <div className="mt-1 text-lg font-semibold">{doc.grammar_issues}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium">Formatting Issues</div>
                        <div className="mt-1 text-lg font-semibold">{doc.formatting_issues}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-sm font-medium">Style Issues</div>
                        <div className="mt-1 text-lg font-semibold">{doc.style_issues}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Common Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Grammar Errors</span>
                <span className="font-medium">0</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Formatting Issues</span>
                <span className="font-medium">0</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Style Inconsistencies</span>
                <span className="font-medium">0</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Plagiarism Risk</span>
                <span className="font-medium">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Auto-Fix Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Grammar Correction</span>
                </div>
                <Button variant="outline" size="sm" disabled>Apply</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Format Standardization</span>
                </div>
                <Button variant="outline" size="sm" disabled>Apply</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Style Enhancement</span>
                </div>
                <Button variant="outline" size="sm" disabled>Apply</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Readability Improvement</span>
                </div>
                <Button variant="outline" size="sm" disabled>Apply</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ErrorsSolution;
