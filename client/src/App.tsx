import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast"; // ✅ new hot-toast import

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

function LayoutWrapper() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="bg-black text-white min-h-screen">
      {!isAdminRoute && <Navbar />}

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
        <Route element={<PrivateRoutes />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/contacts" element={<ContactManager />} />
          <Route path="/admin/portfolio" element={<PortfolioManager />} />
          <Route
            path="/admin/portfolio/edit/:id"
            element={<EditPortfolioPage />}
          />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}

      {/* ✅ Global Hot Toast Container */}
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
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
