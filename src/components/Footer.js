// components/Navbar.js
import React from "react";
import { Button } from "./ui/button";
import { Hammer } from "lucide-react";

const Navbar = () => {
  return (
    <footer className="p-4">
      <p className="flex">
        <Hammer className="mr-3" />
        BUIDLR
      </p>
    </footer>
  );
};

export default Navbar;
