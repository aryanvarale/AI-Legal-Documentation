
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { DocumentType } from "@/types/document";
import { Progress } from "@/components/ui/progress";

type DocumentsTableProps = {
  documents: DocumentType[];
  onViewDocument: (id: string) => void;
}

export const DocumentsTable = ({ documents, onViewDocument }: DocumentsTableProps) => {
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
          {documents.map((doc) => (
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
                      {doc.status === 'Analyzed' && (
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
                  onClick={() => onViewDocument(doc.id)}
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
