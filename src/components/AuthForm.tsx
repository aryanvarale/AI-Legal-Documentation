
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, FileText } from "lucide-react";
import { toast } from "sonner";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, we would call an authentication API here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Example validation
      if (!email.includes('@')) {
        throw new Error("Please enter a valid email address");
      }
      
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      // Simulate successful authentication
      localStorage.setItem("user", JSON.stringify({ email, name: name || email.split('@')[0] }));
      
      toast.success(type === "login" ? "Logged in successfully!" : "Account created successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-brand-purple flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl">SleekScribe</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {type === "login" ? "Welcome back" : "Create an account"}
          </CardTitle>
          <CardDescription className="text-center">
            {type === "login" 
              ? "Enter your credentials to access your account" 
              : "Enter your information to create an account"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="john@example.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {type === "login" && (
                  <Link to="/forgot-password" className="text-xs text-brand-purple hover:underline">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple/90"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : type === "login" ? "Log in" : "Sign up"}
            </Button>
            <p className="text-center text-sm">
              {type === "login" ? "Don't have an account? " : "Already have an account? "}
              <Link 
                to={type === "login" ? "/signup" : "/login"} 
                className="text-brand-purple hover:underline font-medium"
              >
                {type === "login" ? "Sign up" : "Log in"}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
