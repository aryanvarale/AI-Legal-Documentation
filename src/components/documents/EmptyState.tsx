
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

type EmptyStateProps = {
  searchQuery: string;
  onUpload: () => void;
}

export const EmptyState = ({ searchQuery, onUpload }: EmptyStateProps) => {
  return (
    <div className="p-8 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
        <FileText className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-1">No documents found</h3>
      <p className="text-muted-foreground mb-4">
        {searchQuery ? `No results for "${searchQuery}"` : "Upload your first document to get started"}
      </p>
      {!searchQuery && (
        <Button onClick={onUpload} variant="outline">Upload Document</Button>
      )}
    </div>
  );
};
