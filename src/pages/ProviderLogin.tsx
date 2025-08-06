import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ArrowRight, Users } from "lucide-react";
import Button from "../../components/UI/Button";

export default function ProviderLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please fill all required fields");
      return;
    }

    if (isSignup && !name.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsLoading(true);

    // Demo provider login
    if (email === "provider@demo.com" && password === "provider123") {
      localStorage.setItem(
        "demoUser",
        JSON.stringify({
          _id: "demo-provider-1",
          id: "demo-provider-1",
          name: "Demo Provider",
          email: "provider@demo.com",
          role: "provider",
          businessName: "Demo Music Academy",
          phone: "+91 98765 43210",
          isVerified: true,
          location: {
            city: "Gurgaon",
            area: "Sector 15",
            pincode: "122001",
            coordinates: { lat: 28.4595, lng: 77.0266 },
          },
        })
      );
      alert("Demo provider login successful! Redirecting to dashboard...");
      setTimeout(() => {
        window.location.href = "/provider/dashboard";
      }, 1000);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignup) {
        await signUp(email, password, { name, role: "provider" });
        alert(
          "Account created! Please check your email for a verification link before logging in."
        );
        setIsLoading(false);
        setIsSignup(false);
        return;
      } else {
        await login(email, password, "provider");
        // AuthContext will handle navigation
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.message === "Login timeout") {
        alert(
          "Login is taking too long. Please check your internet connection and try again."
        );
      } else if (error.message.includes("Invalid login credentials")) {
        alert("Invalid email or password. Please check your credentials.");
      } else if (error.message.includes("Email not confirmed")) {
        alert(
          "Please check your email and click the confirmation link before logging in."
        );
      } else if (error.message.includes("User already registered")) {
        alert(
          "An account with this email already exists. Please login instead."
        );
      } else if (error.message.includes("Failed to fetch")) {
        alert(
          "Unable to connect to the server. Please check your internet connection and Supabase configuration."
        );
      } else {
        alert(error.message || "Authentication failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignup ? "Join BrightRoots" : "Provider Login"}
          </h1>
          <p className="text-gray-600">
            {isSignup
              ? "Start your journey as an education provider"
              : "Welcome back! Please login to continue."}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignup ? "Create a password" : "Enter your password"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                minLength={6}
              />
              {isSignup && (
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full group"
              disabled={isLoading}
            >
              <span>
                {isLoading
                  ? "Please wait..."
                  : isSignup
                  ? "Create Account"
                  : "Login"}
              </span>
              {!isLoading && (
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don't have an account? Sign up"}
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                Demo Credentials:
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Provider Login:</strong> provider@demo.com / provider123
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <div className="space-y-2">
            <div>
              <Link
                to="/provider/signup"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Don't have an account? Sign up here
              </Link>
            </div>
            <Button to="/" variant="outline" size="sm">
              Looking for classes? Switch to Parent App
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
