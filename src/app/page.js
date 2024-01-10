"use client";

// pages/contact.js
import React from "react";
import SnapshotForm from "../components/snapshotForm";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-screen-xl mx-auto">
        <h1>📸 Snapshot</h1>
        <p class="max-w-[700px] text-lg text-muted-foreground mt-4">
          The most robust snapshot tool on the blockchain.
        </p>
      </div>
      <SnapshotForm />
    </div>
  );
};

export default ContactPage;
