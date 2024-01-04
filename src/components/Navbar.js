// components/Navbar.js
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div id="logo" className="flex items-center">
        <img src="/your-logo.png" alt="Logo" className="w-8 mr-2" />{" "}
      </div>
      <button id="button" className="bg-green-500 text-white px-4 py-2 rounded">
        Button
      </button>
    </header>
  );
};

export default Navbar;
