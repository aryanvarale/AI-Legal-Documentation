
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type UploadProgressProps = {
  isUploading: boolean;
  uploadProgress: number;
}

export const UploadProgress = ({ isUploading, uploadProgress }: UploadProgressProps) => {
  if (!isUploading) return null;
  
  return (
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
  );
};
