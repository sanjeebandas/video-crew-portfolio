import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav className="w-full text-white py-2 shadow-md relative z-50">
      {/* 
        Navbar content rail matches body content max-width 
        for consistent visual alignment on ultra-wide displays
      */}
      <div className="max-w-[1248px] 2xl:max-w-[1400px] 3xl:max-w-[1600px] mx-auto px-2 3xl:px-4 flex items-center justify-between font-suit">
        {/* Logo */}
        <div className="flex items-center space-x-3 -ml-1 md:ml-0 lg:-ml-4 3xl:ml-0">
          <Link to="/" className="group">
            <img
              src="/imgs/Frame 362.png"
              alt="Logo"
              className="h-12 md:h-13 w-auto group-hover:scale-110 transition-all duration-300 ease-out"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-12 2xl:space-x-14 3xl:space-x-16 text-xl 2xl:text-xl 3xl:text-2xl font-medium -mr-1 md:mr-0 lg:-mr-4 3xl:mr-0">
          <li>
            <Link
              to="/about"
              className={`relative transition-all duration-300 ease-out group ${
                location.pathname === "/about" ? "text-blue-400" : "hover:text-blue-400"
              }`}
            >
              회사소개
              <span className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-300 ease-out ${
                location.pathname === "/about" ? "opacity-100" : "opacity-0"
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/process"
              className={`relative transition-all duration-300 ease-out group ${
                location.pathname === "/process" ? "text-blue-400" : "hover:text-blue-400"
              }`}
            >
              프로세스
              <span className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-300 ease-out ${
                location.pathname === "/process" ? "opacity-100" : "opacity-0"
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/differentiation"
              className={`relative transition-all duration-300 ease-out group ${
                location.pathname === "/differentiation" ? "text-blue-400" : "hover:text-blue-400"
              }`}
            >
              차별점
              <span className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-300 ease-out ${
                location.pathname === "/differentiation" ? "opacity-100" : "opacity-0"
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/portfolio"
              className={`relative transition-all duration-300 ease-out group ${
                location.pathname === "/portfolio" ? "text-blue-400" : "hover:text-blue-400"
              }`}
            >
              포트폴리오
              <span className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-300 ease-out ${
                location.pathname === "/portfolio" ? "opacity-100" : "opacity-0"
              }`}></span>
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`relative transition-all duration-300 ease-out group ${
                location.pathname === "/contact" ? "text-blue-400" : "hover:text-blue-400"
              }`}
            >
              문의하기
              <span className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-300 ease-out ${
                location.pathname === "/contact" ? "opacity-100" : "opacity-0"
              }`}></span>
            </Link>
          </li>
        </ul>

        {/* Hamburger Toggle */}
        <div
          className="md:hidden cursor-pointer z-50 hover:scale-110 transition-transform duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <div className="text-4xl font-bold hover:text-blue-400 transition-colors duration-200">&times;</div> // Close icon
          ) : (
            <div className="flex flex-col space-y-[8px] group">
              <div className="w-8 h-[3px] bg-white group-hover:bg-blue-400 transition-all duration-200"></div>
              <div className="w-8 h-[3px] bg-white group-hover:bg-blue-400 transition-all duration-200"></div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm p-6 z-40 flex flex-col items-start justify-center space-y-8 text-xl font-medium pl-8">
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className={`hover:scale-110 transition-all duration-300 ease-out ${
              location.pathname === "/about" ? "text-blue-400" : "hover:text-blue-400"
            }`}
          >
            회사소개
          </Link>
          <Link
            to="/process"
            onClick={() => setIsOpen(false)}
            className={`hover:scale-110 transition-all duration-300 ease-out ${
              location.pathname === "/process" ? "text-blue-400" : "hover:text-blue-400"
            }`}
          >
            프로세스
          </Link>
          <Link
            to="/differentiation"
            onClick={() => setIsOpen(false)}
            className={`hover:scale-110 transition-all duration-300 ease-out ${
              location.pathname === "/differentiation" ? "text-blue-400" : "hover:text-blue-400"
            }`}
          >
            차별점
          </Link>
          <Link
            to="/portfolio"
            onClick={() => setIsOpen(false)}
            className={`hover:scale-110 transition-all duration-300 ease-out ${
              location.pathname === "/portfolio" ? "text-blue-400" : "hover:text-blue-400"
            }`}
          >
            포트폴리오
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className={`hover:scale-110 transition-all duration-300 ease-out ${
              location.pathname === "/contact" ? "text-blue-400" : "hover:text-blue-400"
            }`}
          >
            문의하기
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
