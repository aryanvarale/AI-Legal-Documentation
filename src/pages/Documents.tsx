
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DocumentType, mockDocuments } from "@/types/document";
import { DocumentsTable } from "@/components/documents/DocumentsTable";
import { EmptyState } from "@/components/documents/EmptyState";
import { UploadProgress } from "@/components/documents/UploadProgress";
import { useDocumentUpload } from "@/hooks/useDocumentUpload";

const Documents = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<DocumentType[]>(mockDocuments);
  
  const { isUploading, uploadProgress, handleUpload } = useDocumentUpload(documents, setDocuments);
  
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleViewDocument = (id: string) => {
    toast({
      title: "Feature Coming Soon",
      description: "Document view is being implemented",
    });
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
      
      <UploadProgress isUploading={isUploading} uploadProgress={uploadProgress} />
      
      <Card>
        {filteredDocuments.length === 0 ? (
          <EmptyState searchQuery={searchQuery} onUpload={handleUpload} />
        ) : (
          <DocumentsTable documents={filteredDocuments} onViewDocument={handleViewDocument} />
        )}
      </Card>
    </div>
  );
};

export default Documents;
