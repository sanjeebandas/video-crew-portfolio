import React, { useState, useEffect } from "react";

type Props = {};

const Navbar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  // Optional: Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav className="w-full text-white py-4 shadow-md relative z-50">
      <div className="max-w-[1248px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src="/sample-logo.png" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8 text-sm font-medium">
          <li className="hover:text-gray-300 cursor-pointer">Lorem 1</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 2</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 3</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 4</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 5</li>
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
          <li className="hover:text-gray-300 cursor-pointer">Lorem 1</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 2</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 3</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 4</li>
          <li className="hover:text-gray-300 cursor-pointer">Lorem 5</li>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
