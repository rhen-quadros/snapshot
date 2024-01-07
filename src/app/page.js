"use client";

// pages/contact.js
import React from "react";
import ContactForm from "../components/ContactForm";
import SnapshotForm from "../components/snapshotForm";
import Navbar from "../components/Navbar";

const ContactPage = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div className="p-8">
        <h1>📸 Snapshot</h1>
        <p class="max-w-[700px] text-lg text-muted-foreground mt-4">
          The most robust snapshot tool on the blockchain.
        </p>
      </div>
      {/* <ContactForm /> */}
      <SnapshotForm />
    </div>
  );
};

export default ContactPage;
