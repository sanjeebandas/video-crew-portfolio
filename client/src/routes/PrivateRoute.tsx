import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotFoundClean from "../pages/NotFoundClean";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // Show 404 page for unauthenticated users instead of redirecting to login
  return isAuthenticated ? <Outlet /> : <NotFoundClean />;
};

export default PrivateRoute;
