
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Check, X, Upload, FileText, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ErrorsSolution = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpload = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Document upload functionality is being implemented",
    });
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
              {/* This is where document error items would be rendered */}
              <p className="py-4 text-center text-muted-foreground">No documents found</p>
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
