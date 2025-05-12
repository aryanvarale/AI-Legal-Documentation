import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DocumentType } from "@/types/document";
import { FileText, AlertTriangle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DocumentsTableProps {
  documents: DocumentType[];
  onViewDocument: (id: string) => void;
  onDeleteDocument?: (id: string) => void;
}

export function DocumentsTable({ documents, onViewDocument, onDeleteDocument }: DocumentsTableProps) {
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Analyzed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Analyzing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const handleDelete = (id: string) => {
    if (onDeleteDocument) {
      setDocumentToDelete(id);
    }
  };
  
  const confirmDelete = () => {
    if (documentToDelete && onDeleteDocument) {
      onDeleteDocument(documentToDelete);
      setDocumentToDelete(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Document</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Grammar</TableHead>
              <TableHead>Formatting</TableHead>
              <TableHead>Style</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell className="font-medium">{document.name}</TableCell>
                <TableCell>{document.type}</TableCell>
                <TableCell>{document.size}</TableCell>
                <TableCell>{document.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(document.status)}
                    <span className="capitalize">{document.status}</span>
                  </div>
                  {document.status === 'Analyzing' && (
                    <Progress value={(document as any).progress} className="h-1 mt-2" />
                  )}
                </TableCell>
                <TableCell>
                  {document.status === 'Analyzed' ? 
                    <span className={`font-medium ${(document as any).score >= 80 ? 'text-green-500' : (document as any).score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                      {(document as any).score}/100
                    </span> : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  {document.status === 'Analyzed' ? 
                    <span className="font-medium text-red-500">
                      {(document as any).grammar_issues}
                    </span> : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  {document.status === 'Analyzed' ? 
                    <span className="font-medium text-amber-500">
                      {(document as any).formatting_issues}
                    </span> : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  {document.status === 'Analyzed' ? 
                    <span className="font-medium text-blue-500">
                      {(document as any).style_issues}
                    </span> : 
                    '-'
                  }
                </TableCell>
                <TableCell className="text-right flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => onViewDocument(document.id)}
                    disabled={document.status === 'Analyzing'}
                  >
                    View
                  </Button>
                  {onDeleteDocument && (
                    <Button 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => handleDelete(document.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={!!documentToDelete} onOpenChange={() => setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the document
              and all its associated analysis data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
