
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Edit2, Upload, Save, User } from "lucide-react";

const Profile = () => {
  const { user, profile, updateProfile } = useAuth();
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setFullName(profile.full_name || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);
  
  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const updatedProfile = {
        username,
        full_name: fullName,
        bio,
        avatar_url: avatarUrl
      };
      
      await updateProfile(updatedProfile);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAvatarUpload = () => {
    // In a real app, this would open a file picker and upload the image
    toast({
      title: "Feature Coming Soon",
      description: "Avatar upload functionality is being implemented",
    });
  };
  
  if (!user) {
    return (
      <div className="p-8 text-center">
        <p>Please log in to view your profile</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={username || user.email} />
                ) : (
                  <AvatarFallback className="bg-brand-purple text-white text-2xl">
                    {username ? username.substring(0, 2).toUpperCase() : 
                     user.email ? user.email.substring(0, 2).toUpperCase() : 'US'}
                  </AvatarFallback>
                )}
              </Avatar>
              {isEditing && (
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0"
                  onClick={handleAvatarUpload}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-4 flex-1 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input 
                  id="fullName" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input 
                  id="bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-500">Documents Created</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-500">Documents Analyzed</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-gray-500">Issues Fixed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
