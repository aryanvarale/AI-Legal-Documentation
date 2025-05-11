
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const mockDocuments = [
  {
    id: '1',
    name: 'Business Proposal.docx',
    type: 'DOCX',
    size: '1.2 MB',
    status: 'Analyzed',
    score: 85,
    date: '2025-05-01',
    issues: 7
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
    date: '2025-05-08',
    issues: 3
  },
  {
    id: '4',
    name: 'Financial Report Q1.pdf',
    type: 'PDF',
    size: '3.8 MB',
    status: 'Analyzed',
    score: 78,
    date: '2025-04-15',
    issues: 12
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

const Documents = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState(mockDocuments);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUpload = () => {
    // In a real app, we would open a file dialog
    toast({
      title: "Uploading document",
      description: "Starting upload process...",
    });
    
    // Simulate file upload and processing
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Add a new document to the list
          const newDocument = {
            id: String(documents.length + 1),
            name: "New Document.pdf",
            type: 'PDF',
            size: '1.8 MB',
            status: 'Analyzing',
            progress: 0,
            date: new Date().toISOString().split('T')[0],
          };
          
          setDocuments(prev => [newDocument, ...prev]);
          
          // Simulate analysis starting
          setTimeout(() => {
            setIsUploading(false);
            
            toast({
              title: "Upload complete",
              description: "Document is now being analyzed",
            });
            
            // Simulate analysis progress
            let analysisProgress = 0;
            const analysisInterval = setInterval(() => {
              analysisProgress += 5;
              
              setDocuments(prev => 
                prev.map(doc => 
                  doc.id === newDocument.id 
                    ? { ...doc, progress: analysisProgress }
                    : doc
                )
              );
              
              if (analysisProgress >= 100) {
                clearInterval(analysisInterval);
                
                // Mark as analyzed
                setDocuments(prev => 
                  prev.map(doc => 
                    doc.id === newDocument.id 
                      ? { 
                          ...doc, 
                          status: 'Analyzed', 
                          score: Math.floor(Math.random() * 20) + 80,
                          issues: Math.floor(Math.random() * 10) + 1
                        }
                      : doc
                  )
                );
                
                toast({
                  title: "Analysis complete",
                  description: "Document has been analyzed successfully",
                });
              }
            }, 300);
          }, 1000);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Analyzed':
        return 'bg-green-500';
      case 'Analyzing':
        return 'bg-blue-500';
      case 'Failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
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
      
      {isUploading && (
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded bg-brand-light-purple flex items-center justify-center">
              <FileText className="h-5 w-5 text-brand-purple" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Uploading document...</p>
              <div className="flex items-center gap-2">
                <Progress value={uploadProgress} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">{uploadProgress}%</span>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      <Card>
        {filteredDocuments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No documents found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? `No results for "${searchQuery}"` : "Upload your first document to get started"}
            </p>
            {!searchQuery && (
              <Button onClick={handleUpload} variant="outline">Upload Document</Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">Size</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/20">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-brand-light-purple flex items-center justify-center">
                          <FileText className="h-5 w-5 text-brand-purple" />
                        </div>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{doc.type}</td>
                    <td className="p-4 text-muted-foreground">{doc.size}</td>
                    <td className="p-4">
                      {doc.status === 'Analyzing' ? (
                        <div className="w-32">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full bg-blue-500`}></div>
                            <span className="text-sm">{doc.status}</span>
                          </div>
                          <Progress value={doc.progress} className="h-1.5" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(doc.status)}`}></div>
                          <span>
                            {doc.status}
                            {doc.status === 'Analyzed' && doc.score && (
                              <span className="ml-1 text-sm text-muted-foreground">
                                ({doc.score}%)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(doc.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Document view is being implemented",
                          });
                        }}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Documents;
