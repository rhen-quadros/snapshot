// components/ContactForm.js
"use client";

import React, { useState, useEffect } from "react";
import { getAssetsByGroup } from "../lib/api";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    creatorAddress: "",
    traits: "",
    date: "",
    notListed: false,
  });

  const [unlistedHolders, setUnlistedHolders] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make the API call here
    try {
      const creatorAddress = formData.creatorAddress;
      const marketplace = formData.notListed;
      const result = await getAssetsByGroup(creatorAddress, marketplace);
      setUnlistedHolders(result);
      console.log("Unlisted Holders:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        {/* Name input field */}
        <div className="mb-4">
          {" "}
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Creator Address
          </label>
          <input
            type="text"
            id="creatorAddress"
            name="creatorAddress"
            value={formData.creatorAddress}
            onChange={handleChange}
            className="appearance-none text-black border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="checkbox"
            id="notListed"
            name="notListed"
            checked={formData.notListed}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
          <label className="text-gray-700 text-sm" htmlFor="agreeToTerms">
            Unlisted on marketplaces
          </label>
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </div>
      </form>

      {/* Display the API results */}
      {unlistedHolders.length > 0 && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Unlisted Holders:</h2>
          <ul>
            {unlistedHolders.map((holder, index) => (
              <li key={index}>{holder}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ContactForm;
