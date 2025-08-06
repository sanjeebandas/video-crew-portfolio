import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav className="w-full text-white py-4 shadow-md relative z-50">
      <div className="max-w-[1248px] mx-auto px-2 flex items-center justify-between font-suit">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/">
            <img
              src="imgs/Frame 362.png"
              alt="Logo"
              className="h-8 w-auto hover:scale-105 transition-transform duration-200"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          <li>
            <Link
              to="/about"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              회사소개
            </Link>
          </li>
          <li>
            <Link
              to="/process"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              프로세스
            </Link>
          </li>
          <li>
            <Link
              to="/differentiation"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              차별점
            </Link>
          </li>
          <li>
            <Link
              to="/portfolio"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              포트폴리오
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              문의하기
            </Link>
          </li>
        </ul>

        {/* Hamburger Toggle */}
        <div
          className="md:hidden cursor-pointer z-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <div className="text-2xl font-bold">&times;</div> // Close icon
          ) : (
            <div className="flex flex-col space-y-[6px]">
              <div className="w-6 h-[2px] bg-white"></div>
              <div className="w-6 h-[2px] bg-white"></div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm p-6 z-40 flex flex-col items-center justify-center space-y-6 text-sm font-medium">
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-300 transition-colors duration-200"
          >
            회사소개
          </Link>
          <Link
            to="/process"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-300 transition-colors duration-200"
          >
            프로세스
          </Link>
          <Link
            to="/differentiation"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-300 transition-colors duration-200"
          >
            차별점
          </Link>
          <Link
            to="/portfolio"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-300 transition-colors duration-200"
          >
            포트폴리오
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-300 transition-colors duration-200"
          >
            문의하기
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
