
import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Home, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem("user");
    
    if (!userJson) {
      navigate("/login");
      return;
    }
    
    try {
      const userData = JSON.parse(userJson);
      setUser(userData);
    } catch (e) {
      navigate("/login");
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };
  
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar>
          <div className="flex items-center gap-2 px-4 py-3 border-b h-16">
            <div className="h-8 w-8 rounded-lg bg-brand-purple flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">SleekScribe</span>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard")}>
                        <Home className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard/documents")}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Documents</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/dashboard/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </Button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <div className="mt-auto border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-brand-purple text-white">
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </Sidebar>
        
        <main className="flex-1 overflow-auto">
          <header className="h-16 border-b bg-white flex items-center justify-between px-6">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              {/* Will add notification and user dropdown later */}
            </div>
          </header>
          
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
