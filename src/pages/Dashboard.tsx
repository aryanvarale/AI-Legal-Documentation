
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckCircle, X, Plus, FileDown, FilePlus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreateDocument = () => {
    navigate("/dashboard/create-document");
  };
  
  const handleErrorsSolution = () => {
    navigate("/dashboard/errors-solution");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Button onClick={() => navigate("/dashboard/documents")} variant="outline" className="bg-gray-100">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Document Button Card */}
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleCreateDocument}>
          <div className="bg-gradient-to-br from-brand-purple to-brand-blue p-6 flex flex-col items-center justify-center text-white aspect-video">
            <FilePlus className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold">Create Document</h2>
            <p className="text-sm opacity-80 mt-2">Create and edit new documents</p>
          </div>
        </Card>
        
        {/* Errors Solution Button Card */}
        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={handleErrorsSolution}>
          <div className="bg-gradient-to-br from-brand-blue to-cyan-500 p-6 flex flex-col items-center justify-center text-white aspect-video">
            <AlertCircle className="h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold">Errors Solution</h2>
            <p className="text-sm opacity-80 mt-2">View and fix document issues</p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Issues Fixed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Documents</h2>
        </div>
        
        <Card>
          <div className="divide-y">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">Loading documents...</div>
            ) : recentDocuments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No documents yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first document or create a new one</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => navigate("/dashboard/documents")} variant="outline">Upload Document</Button>
                  <Button onClick={handleCreateDocument}>Create Document</Button>
                </div>
              </div>
            ) : (
              // This will display documents when they're available
              <div className="p-4 text-center text-muted-foreground">No documents found</div>
            )}
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-green-100 text-green-500 rounded-full p-1">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Create account</p>
                  <p className="text-sm text-muted-foreground">Your account is ready to use</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-gray-100 text-gray-400 rounded-full p-1">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Upload first document</p>
                  <p className="text-sm text-muted-foreground">Upload a document to analyze</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-gray-100 text-gray-400 rounded-full p-1">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Complete profile</p>
                  <p className="text-sm text-muted-foreground">Add your personal information</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-gray-100 text-gray-400 rounded-full p-1">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Create your first document</p>
                  <p className="text-sm text-muted-foreground">Use our editor to create a document</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Document Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Grammar Issues</span>
                  <span className="font-medium">0</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Formatting Inconsistencies</span>
                  <span className="font-medium">0</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Style Improvements</span>
                  <span className="font-medium">0</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Readability Score</span>
                  <span className="font-medium">N/A</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
