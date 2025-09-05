import { useAuth } from "../../context/AuthContext";
import NotFoundClean from "../../pages/NotFoundClean";

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

const AdminRouteGuard = ({ children }: AdminRouteGuardProps) => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, show 404 page
  if (!isAuthenticated) {
    return <NotFoundClean />;
  }

  // If authenticated, render the children (admin content)
  return <>{children}</>;
};

export default AdminRouteGuard;
