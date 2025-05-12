
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  FilePlus, 
  Save, 
  FileDown, 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  ListOrdered, 
  List, 
  Heading1, 
  Heading2 
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CreateDocument = () => {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Set up the editable content
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = "true";
    }
  }, []);

  // Handle formatting buttons
  const formatDoc = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const saveDocument = async () => {
    if (!user) {
      toast.error("You need to be logged in to save documents");
      return;
    }

    setIsSaving(true);
    try {
      // Get the HTML content from the editor
      const docContent = editorRef.current?.innerHTML || "";
      
      // In a real app, this would save to Supabase or another database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
      
      toast.success("Document saved successfully!");
    } catch (error) {
      toast.error("Failed to save document");
      console.error("Error saving document:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadDocument = async (format: 'pdf' | 'docx') => {
    try {
      // In a real application, you would convert the HTML to PDF/DOCX here
      // For now, we'll just show a toast
      toast.success(`Document would download as ${format.toUpperCase()} file`);
      
      // Here's what you would typically do:
      // 1. Send the HTML content to a server endpoint that converts it
      // 2. Or use a client-side library (though PDF generation in browser is challenging)
      // 3. Create a download link for the resulting file
    } catch (error) {
      toast.error(`Failed to download document as ${format}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Create Document</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => downloadDocument('docx')}>
            <FileDown className="mr-2 h-4 w-4" />
            Download as DOCX
          </Button>
          <Button variant="outline" onClick={() => downloadDocument('pdf')}>
            <FileDown className="mr-2 h-4 w-4" />
            Download as PDF
          </Button>
          <Button onClick={saveDocument} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Document'}
          </Button>
        </div>
      </div>
      
      <div>
        <Input 
          value={documentTitle} 
          onChange={e => setDocumentTitle(e.target.value)}
          className="text-xl font-bold border-none focus-visible:ring-0 px-0"
        />
      </div>
      
      <Card className="p-2">
        <div className="bg-gray-50 border rounded-md p-2 mb-4 flex flex-wrap gap-1">
          <Button size="sm" variant="ghost" onClick={() => formatDoc('bold')}>
            <Bold size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('italic')}>
            <Italic size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('underline')}>
            <Underline size={16} />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('justifyLeft')}>
            <AlignLeft size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('justifyCenter')}>
            <AlignCenter size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('justifyRight')}>
            <AlignRight size={16} />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('insertOrderedList')}>
            <ListOrdered size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('insertUnorderedList')}>
            <List size={16} />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('formatBlock', '<h1>')}>
            <Heading1 size={16} />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => formatDoc('formatBlock', '<h2>')}>
            <Heading2 size={16} />
          </Button>
        </div>
        
        <div 
          ref={editorRef} 
          className="min-h-[500px] border rounded-md p-6 focus:outline-none" 
          style={{
            fontFamily: 'Arial, sans-serif',
            lineHeight: 1.5,
            fontSize: '16px'
          }}
        >
          {/* This div will be contentEditable */}
          Start typing your document here...
        </div>
      </Card>
    </div>
  );
};

export default CreateDocument;
