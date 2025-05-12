import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Moon, Sun, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UserSettings {
  theme: string;
  notifications_enabled: boolean;
  email_digest: boolean;
  error_notifications: boolean;
}

const Settings = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>({
    theme: "system",
    notifications_enabled: true,
    email_digest: false,
    error_notifications: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    fetchUserSettings();
  }, [user, isLoading, navigate]);

  const fetchUserSettings = async () => {
    if (!user) return;

    try {
      setIsFetching(true);
      const { data, error } = await (supabase as any)
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        // If no settings exist yet, we'll use defaults
        if (error.code === 'PGRST116') {
          console.log('No settings found, using defaults');
        } else {
          console.error('Error fetching settings:', error);
          toast.error('Failed to load settings');
        }
      } else if (data) {
        setSettings({
          theme: data.theme || 'system',
          notifications_enabled: data.notifications_enabled !== false,
          email_digest: !!data.email_digest,
          error_notifications: data.error_notifications !== false
        });
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while loading settings');
    } finally {
      setIsFetching(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      const { error } = await (supabase as any)
        .from('user_settings')
        .upsert({
          user_id: user.id,
          theme: settings.theme,
          notifications_enabled: settings.notifications_enabled,
          email_digest: settings.email_digest,
          error_notifications: settings.error_notifications,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
        return;
      }

      toast.success('Settings saved successfully');
    } catch (err) {
      console.error('Error:', err);
      toast.error('An error occurred while saving settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              <Moon className="h-5 w-5" />
              <span>Appearance</span>
            </CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="theme" className="md:col-span-1">Theme</Label>
                <div className="md:col-span-3">
                  <Select 
                    value={settings.theme} 
                    onValueChange={(value) => handleChange('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Enable notifications</p>
                  <p className="text-sm text-muted-foreground">Receive notifications about your documents</p>
                </div>
                <Switch 
                  checked={settings.notifications_enabled}
                  onCheckedChange={(checked) => handleChange('notifications_enabled', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Error notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified when errors occur in your documents</p>
                </div>
                <Switch 
                  checked={settings.error_notifications}
                  onCheckedChange={(checked) => handleChange('error_notifications', checked)}
                  disabled={!settings.notifications_enabled}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <span>Email Preferences</span>
            </CardTitle>
            <CardDescription>Configure email notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly digest</p>
                  <p className="text-sm text-muted-foreground">Receive a weekly summary of your document activity</p>
                </div>
                <Switch 
                  checked={settings.email_digest}
                  onCheckedChange={(checked) => handleChange('email_digest', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button 
            onClick={saveSettings}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving</span>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 