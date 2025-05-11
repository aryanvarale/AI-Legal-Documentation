
import { useState } from "react";
import { DocumentType, AnalyzingDocument, AnalyzedDocument } from "@/types/document";
import { useToast } from "@/hooks/use-toast";

export const useDocumentUpload = (
  documents: DocumentType[],
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>
) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
          const newDocument: AnalyzingDocument = {
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
                    ? { ...doc, progress: analysisProgress } as AnalyzingDocument
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
                          id: doc.id,
                          name: doc.name,
                          type: doc.type,
                          size: doc.size,
                          date: doc.date,
                          status: 'Analyzed',
                          score: Math.floor(Math.random() * 20) + 80,
                          issues: Math.floor(Math.random() * 10) + 1
                        } as AnalyzedDocument
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

  return {
    isUploading,
    uploadProgress,
    handleUpload
  };
};
