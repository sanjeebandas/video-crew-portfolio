import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, validateToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("🛡️ AuthGuard checking authentication...");
      console.log("📊 Auth state:", { isAuthenticated, isLoading });
      
      if (!isLoading) {
        if (!isAuthenticated) {
          console.log("❌ User not authenticated, redirecting to login");
          toast.error("Please log in to access admin panel");
          navigate("/admin/login");
          return;
        }

        // Validate token on every admin page load
        console.log("🔍 Validating token in AuthGuard...");
        const isValid = await validateToken();
        console.log("✅ Token validation result in AuthGuard:", isValid);
        
        if (!isValid) {
          console.log("❌ Token invalid, redirecting to login");
          toast.error("Session expired. Please log in again");
          navigate("/admin/login");
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, isLoading, validateToken, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
