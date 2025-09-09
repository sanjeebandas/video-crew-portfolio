import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { initGSAP } from "./utils/animations";
import { incrementPageVisit } from "./services/api";
import InstallPrompt from "./components/common/InstallPrompt";
import OfflineIndicator from "./components/common/OfflineIndicator";
import { useAuth } from "./context/AuthContext";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Process from "./pages/Process";
import Portfolio from "./pages/Portfolio";
import Differentiation from "./pages/Differentiation";
import Contact from "./pages/Contact";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// Admin Pages
import Login from "./pages/admin/Login";
import Dashboard from "./admin/Dashboard";
import ContactManager from "./admin/ContactManager";
import PortfolioManager from "./admin/PortfolioManager";
import PrivateRoutes from "./routes/PrivateRoute";
import EditPortfolioPage from "./pages/EditPortfolioPage";
import AuthGuard from "./components/admin/AuthGuard";
import AdminRouteGuard from "./components/admin/AdminRouteGuard";
import NotFoundClean from "./pages/NotFoundClean";

function LayoutWrapper() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLogin = location.pathname === "/admin/login";
  const isAdminDashboard =
    (location.pathname.startsWith("/admin/dashboard") ||
      location.pathname.startsWith("/admin/contacts") ||
      location.pathname.startsWith("/admin/portfolio")) &&
    isAuthenticated;
  const is404Page = !isAuthenticated && isAdminRoute && !isLoading;

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Track page visits for analytics (only for public pages)
  useEffect(() => {
    if (!isAdminRoute) {
      incrementPageVisit();
    }
  }, [location.pathname, isAdminRoute]);

  // Show loading screen while checking authentication for admin routes
  if (isLoading && isAdminRoute && !isAdminLogin) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {!isAdminDashboard && !isAdminLogin && !is404Page && <Navbar />}

      <Routes>
        {/* --------- PUBLIC ROUTES --------- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/process" element={<Process />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/differentiation" element={<Differentiation />} />
        <Route path="/contact" element={<Contact />} />

        {/* --------- ADMIN ROUTES --------- */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <NotFoundClean />
            </AdminRouteGuard>
          }
        />
        <Route element={<PrivateRoutes />}>
          <Route
            path="/admin/dashboard"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/contacts"
            element={
              <AuthGuard>
                <ContactManager />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/portfolio"
            element={
              <AuthGuard>
                <PortfolioManager />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/portfolio/edit/:id"
            element={
              <AuthGuard>
                <EditPortfolioPage />
              </AuthGuard>
            }
          />
        </Route>

        {/* --------- 404 ROUTE --------- */}
        <Route path="*" element={<NotFoundClean />} />
      </Routes>

      {!isAdminDashboard && !isAdminLogin && !is404Page && <Footer />}

      {/* PWA Components */}
      <InstallPrompt />
      <OfflineIndicator />

      {/* Global Hot Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1f1f1f",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />
    </div>
  );
}

function App() {
  useEffect(() => {
    initGSAP();
  }, []);

  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
