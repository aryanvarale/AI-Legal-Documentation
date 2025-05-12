import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileText, Upload, CheckCircle, X, Plus, FileDown, FilePlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalDocuments: number;
  averageScore: number;
  issuesFixed: number;
}

interface RecentDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  status: string;
  score?: number;
  readability_score?: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    averageScore: 0,
    issuesFixed: 0
  });
  const [recentDocuments, setRecentDocuments] = useState<RecentDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(false);
  const [createdDocument, setCreatedDocument] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);
  
  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Fetch recent documents
      const { data: documents, error: docsError } = await (supabase as any)
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (docsError) {
        console.error("Document fetch error:", docsError);
        // If the table doesn't exist, handle gracefully
        if (docsError.code === '42P01') {
          toast.error("Database setup required. Please run the SQL setup script.");
          setRecentDocuments([]);
          setStats({
            totalDocuments: 0,
            averageScore: 0,
            issuesFixed: 0
          });
        } else {
          throw docsError;
        }
      } else if (documents) {
        setRecentDocuments(documents as any);
        setUploadedDocument(documents.length > 0);
        
        // Calculate stats
        const analyzedDocs = documents.filter((doc: any) => doc.status === 'Analyzed');
        const totalDocs = documents.length;
        const totalScore = analyzedDocs.reduce((sum: number, doc: any) => sum + (doc.score || 0), 0);
        const avgScore = analyzedDocs.length > 0 ? Math.round(totalScore / analyzedDocs.length) : 0;
        
        try {
          // Get total issues
          const { data: suggestionsData, error: suggestionsError } = await (supabase as any)
            .from('document_suggestions')
            .select('id')
            .in('document_id', documents.map((d: any) => d.id));
            
          if (suggestionsError) {
            console.warn("Suggestions fetch error:", suggestionsError);
            // If the table doesn't exist, just use 0
            setStats({
              totalDocuments: totalDocs,
              averageScore: avgScore,
              issuesFixed: 0
            });
          } else {
            setStats({
              totalDocuments: totalDocs,
              averageScore: avgScore,
              issuesFixed: suggestionsData ? suggestionsData.length : 0
            });
          }
        } catch (suggestionsErr) {
          // Recover gracefully
          console.error("Suggestions error:", suggestionsErr);
          setStats({
            totalDocuments: totalDocs,
            averageScore: avgScore,
            issuesFixed: 0
          });
        }
      }
      
      try {
        // Check if profile is complete
        const { data: profileData, error: profileError } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (!profileError && profileData && profileData.full_name) {
          setProfileComplete(true);
        }
      } catch (profileErr) {
        console.error("Profile error:", profileErr);
        // Recover gracefully
      }
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateDocument = () => {
    navigate("/dashboard/create-document");
    setCreatedDocument(true);
  };
  
  const handleErrorsSolution = () => {
    navigate("/dashboard/errors-solution");
  };
  
  const handleUpload = () => {
    navigate("/dashboard/documents");
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <Button onClick={handleUpload} variant="outline" className="bg-gray-100">
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
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.issuesFixed}</div>
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
              <div className="p-4 text-center text-muted-foreground">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-purple mx-auto mb-3"></div>
                Loading documents...
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No documents yet</h3>
                <p className="text-muted-foreground mb-4">Upload your first document or create a new one</p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={handleUpload} variant="outline">Upload Document</Button>
                  <Button onClick={handleCreateDocument}>Create Document</Button>
                </div>
              </div>
            ) : (
              // Display actual documents
              recentDocuments.map(doc => (
                <div key={doc.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-gray-100 rounded p-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{doc.name}</h4>
                        <div>
                          {doc.status === 'Analyzed' && doc.score !== undefined && (
                            <span className="inline-flex items-center rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-semibold text-white">{doc.score}%</span>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {doc.type} • {doc.size} • {new Date(doc.created_at).toLocaleDateString()}
                      </div>
                      <div className="mt-2">
                        <Button 
                          variant="link" 
                          className="px-0 h-auto text-brand-blue" 
                          onClick={() => navigate(`/dashboard/errors-solution?document=${doc.id}`)}
                        >
                          View Analysis
                        </Button>
                      </div>
                    </div>
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
                <div className={`mt-0.5 ${uploadedDocument ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'} rounded-full p-1`}>
                  {uploadedDocument ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium">Upload first document</p>
                  <p className="text-sm text-muted-foreground">Upload a document to analyze</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${profileComplete ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'} rounded-full p-1`}>
                  {profileComplete ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Complete profile</p>
                  <p className="text-sm text-muted-foreground">Add your personal information</p>
                  {!profileComplete && (
                    <Button 
                      variant="link" 
                      className="px-0 h-auto mt-1 text-brand-blue" 
                      onClick={() => navigate("/dashboard/profile")}
                    >
                      Complete Profile
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${createdDocument ? 'bg-green-100 text-green-500' : 'bg-gray-100 text-gray-400'} rounded-full p-1`}>
                  {createdDocument ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
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
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-purple mx-auto mb-3"></div>
                  Loading analysis...
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Grammar Issues</span>
                      <span className="font-medium">
                        {recentDocuments.reduce((sum, doc) => sum + (doc.status === 'Analyzed' ? (doc as any).grammar_issues || 0 : 0), 0)}
                      </span>
                    </div>
                    <Progress 
                      value={recentDocuments.length > 0 ? (recentDocuments.reduce((sum, doc) => sum + ((doc as any).grammar_issues || 0), 0) / (recentDocuments.length * 10)) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Formatting Inconsistencies</span>
                      <span className="font-medium">
                        {recentDocuments.reduce((sum, doc) => sum + (doc.status === 'Analyzed' ? (doc as any).formatting_issues || 0 : 0), 0)}
                      </span>
                    </div>
                    <Progress 
                      value={recentDocuments.length > 0 ? (recentDocuments.reduce((sum, doc) => sum + ((doc as any).formatting_issues || 0), 0) / (recentDocuments.length * 10)) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Style Improvements</span>
                      <span className="font-medium">
                        {recentDocuments.reduce((sum, doc) => sum + (doc.status === 'Analyzed' ? (doc as any).style_issues || 0 : 0), 0)}
                      </span>
                    </div>
                    <Progress 
                      value={recentDocuments.length > 0 ? (recentDocuments.reduce((sum, doc) => sum + ((doc as any).style_issues || 0), 0) / (recentDocuments.length * 10)) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Readability Score</span>
                      <span className="font-medium">
                        {stats.averageScore > 0 ? `${stats.averageScore}%` : 'N/A'}
                      </span>
                    </div>
                    <Progress value={stats.averageScore} className="h-2" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
