// components/Navbar.js
import React from "react";
import { Button } from "./ui/button";
import { Coins, Twitter, Pizza } from "lucide-react";
import Image from "next/image";
import KimbapLogo from "../app/kimbap.png";

const Navbar = () => {
  return (
    <header className="p-4 max-w-screen-xl mx-auto flex flex-col lg:flex-row justify-between items-center">
      <div id="logo" className="flex items-center mb-4 lg:mb-0">
        <Image src={KimbapLogo} width={100} height={100} alt="logo" />
        <h1 className="text-xl">Kimbap Tools</h1>
      </div>
      <div className="flex flex-wrap items-center">
        <a
          href="https://twitter.com/BUIDLR_"
          target="_blank"
          rel="noopener noreferrer"
          className="lg:mb-0 mr-4"
        >
          <Button variant="outline">
            <Twitter />
          </Button>
        </a>
        <a
          href="https://hel.io/x/snapshot"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button className="lg:mt-0">
            Tip Jar <Coins className="ml-3" />
          </Button>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
