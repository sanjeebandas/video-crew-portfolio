import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ContactButton = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide button on contact page to avoid redundancy
  useEffect(() => {
    const isContactPage = location.pathname === "/contact";
    setIsVisible(!isContactPage);
  }, [location.pathname]);

  const handleContactClick = () => {
    navigate("/contact");
    // Remove focus after navigation to prevent hover state from persisting
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 100);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-10 md:right-16 z-50">
      <button
        onClick={handleContactClick}
        className="group relative cursor-pointer bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-5 rounded-full shadow-lg hover:shadow-xl active:shadow-lg transition-all duration-300 ease-in-out hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300/50 focus:scale-110"
        aria-label="Contact us"
      >
        {/* Main contact icon */}
        <i className="fas fa-envelope text-xl"></i>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Contact Us
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
    </div>
  );
};

export default ContactButton;
