import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, UserRound, Mail, Image, Save } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, profile, updateProfile, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    avatar_url: "",
    bio: ""
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }

    // Initialize form with existing profile data
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        avatar_url: profile.avatar_url || "",
        bio: profile.bio || ""
      });
    }
  }, [user, profile, isLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Only update fields that have changed
      const updateData: any = {};
      if (formData.full_name !== profile?.full_name) updateData.full_name = formData.full_name;
      if (formData.username !== profile?.username) updateData.username = formData.username;
      if (formData.avatar_url !== profile?.avatar_url) updateData.avatar_url = formData.avatar_url;
      if (formData.bio !== profile?.bio) updateData.bio = formData.bio;
      
      // Add is_complete flag if full_name is provided
      if (formData.full_name) {
        updateData.is_complete = true;
      }
      
      // Only send update if there are changes
      if (Object.keys(updateData).length > 0) {
        await updateProfile(updateData);
        toast.success("Profile updated successfully");
      } else {
        toast.info("No changes to save");
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            Update your personal information. Your name will be visible to other users.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    <div className="flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      <span>Full Name</span>
                    </div>
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Username</span>
                    </div>
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="avatar_url">
                  <div className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span>Avatar URL</span>
                  </div>
                </Label>
                <Input
                  id="avatar_url"
                  name="avatar_url"
                  placeholder="Enter URL for your profile image"
                  value={formData.avatar_url}
                  onChange={handleChange}
                />
                {formData.avatar_url && (
                  <div className="mt-2">
                    <img 
                      src={formData.avatar_url} 
                      alt="Avatar Preview" 
                      className="w-16 h-16 rounded-full object-cover border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Bio</span>
                  </div>
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell us a bit about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-brand-purple hover:bg-brand-purple/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
