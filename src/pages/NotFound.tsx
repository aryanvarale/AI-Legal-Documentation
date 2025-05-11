
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-brand-purple">404</h1>
          <h2 className="text-2xl font-bold">Page not found</h2>
          <p className="text-gray-500">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
        
        <div className="space-y-3">
          <Button asChild className="w-full bg-brand-purple hover:bg-brand-purple/90">
            <Link to="/">Go back home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
