// components/Navbar.js
import React from "react";
import { Button } from "./ui/button";
import { Coins, Twitter, Pizza } from "lucide-react";
import Image from "next/image";
import OnigiriLogo from "../app/onigiri.png";

const Navbar = () => {
  return (
    <header className="p-6 max-w-screen-xl mx-auto flex justify-between items-center">
      <div id="logo" className="flex items-center">
        <Image src={OnigiriLogo} width={75} height={75} alt="logo" />

        <h1 className="ml-2 text-lg">ONIGIRI</h1>
      </div>
      <div className="flex items-center">
        <Button variant="outline" className="mr-4">
          <Twitter />
        </Button>
        <Button>
          Tip Jar <Coins className="ml-3" />
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
