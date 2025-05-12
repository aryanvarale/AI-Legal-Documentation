
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, FileText, BarChart3 } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-purple flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">DocumentDoctor</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-brand-purple transition-colors">
              Log in
            </Link>
            <Button asChild className="bg-brand-purple hover:bg-brand-purple/90">
              <Link to="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="hero-gradient py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Perfect your documents with AI-powered review
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-10">
                Get instant feedback on grammar, formatting, and style to make 
                your documents polished and professional.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
                  <Link to="/signup">Get started for free</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <Link to="/about">Learn more</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How DocumentDoctor works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="h-12 w-12 bg-brand-light-purple rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Document</h3>
                <p className="text-gray-600">
                  Simply upload your document in various formats including Word, PDF, or plain text.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="h-12 w-12 bg-brand-light-purple rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our advanced AI analyzes your document for grammar, formatting, and style issues.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="h-12 w-12 bg-brand-light-purple rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-brand-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Review Feedback</h3>
                <p className="text-gray-600">
                  Get detailed feedback and suggestions to improve your document quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Features that make document review simple</h2>
            
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                {[
                  "Grammar and spelling correction",
                  "Document formatting analysis",
                  "Style consistency checks",
                  "Readability scoring",
                  "One-click improvements"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-brand-purple flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <div className="aspect-video bg-gray-100 rounded-lg shimmer"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to perfect your documents?</h2>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who trust DocumentDoctor for their document review needs.
            </p>
            <Button asChild size="lg" className="bg-brand-purple hover:bg-brand-purple/90">
              <Link to="/signup">Start using DocumentDoctor</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-12 border-t">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">DocumentDoctor</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-gray-900 text-sm">About</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-gray-900 text-sm">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Grammar Check</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Format Analysis</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Style Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} DocumentDoctor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
