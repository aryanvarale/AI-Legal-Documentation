
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { toast } = useToast();
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call to fetch recent documents
    const fetchRecentDocuments = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockDocuments = [
          {
            id: '1',
            name: 'Business Proposal.docx',
            status: 'Analyzed',
            score: 85,
            date: '2025-05-01',
            issues: 7
          },
          {
            id: '2',
            name: 'Meeting Notes.pdf',
            status: 'Analyzing',
            progress: 65,
            date: '2025-05-09',
          },
          {
            id: '3',
            name: 'Product Roadmap.docx',
            status: 'Analyzed',
            score: 92,
            date: '2025-05-08',
            issues: 3
          },
        ];
        
        setRecentDocuments(mockDocuments);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load recent documents",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentDocuments();
  }, [toast]);
  
  const handleUpload = () => {
    // In a real app, this would open a file picker
    toast({
      title: "Feature Coming Soon",
      description: "Document upload functionality is being implemented",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button onClick={handleUpload} className="bg-brand-purple hover:bg-brand-purple/90">
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Issues Fixed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
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
                <p className="text-muted-foreground mb-4">Upload your first document to get started</p>
                <Button onClick={handleUpload} variant="outline">Upload Document</Button>
              </div>
            ) : (
              recentDocuments.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/20 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-brand-light-purple flex items-center justify-center">
                      <FileText className="h-5 w-5 text-brand-purple" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">Uploaded on {new Date(doc.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {doc.status === 'Analyzing' ? (
                      <div className="w-32">
                        <p className="text-xs mb-1 text-muted-foreground">{doc.progress}% complete</p>
                        <Progress value={doc.progress} className="h-1.5" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium">{doc.score}%</span>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                    )}
                    
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              ))
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
                <div className="mt-0.5 bg-brand-light-purple text-brand-purple rounded-full p-1">
                  <CheckCircle className="h-4 w-4" />
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
                  <p className="font-medium">Explore AI features</p>
                  <p className="text-sm text-muted-foreground">Try out all document analysis features</p>
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
                  <span className="font-medium">12</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Formatting Inconsistencies</span>
                  <span className="font-medium">8</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Style Improvements</span>
                  <span className="font-medium">15</span>
                </div>
                <Progress value={50} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Readability Score</span>
                  <span className="font-medium">Good</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
