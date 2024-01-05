// components/ContactForm.js
"use client";

import React, { useState, useEffect } from "react";
import { getAssetsByGroup } from "../lib/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    creatorAddress: "",
    traits: "",
    date: "",
    notListed: false,
  });

  const [snapshotList, setsnapshotList] = useState([]);

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
      setsnapshotList(result);
      console.log("Unlisted Holders:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-8">
        {/* Name input field */}
        <div className="mb-4">
          {" "}
          <label className="block text-gray-700 text-sm font-bold mb-2">
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
      {snapshotList.length > 0 && (
        <div className="max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Wallet Address</h2>
          <ul>
            {snapshotList.map((holder, index) => (
              <li key={index}>{holder}</li>
            ))}
          </ul>
        </div>
      )}
      {/* <div className="mx-20">
        <h2 className="text-xl font-bold mb-4 p-4">Results</h2>
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b dark:border-gray-600">Index</th>
              <th className="py-2 px-4 border-b dark:border-gray-600">
                Holder
              </th>
            </tr>
          </thead>
          <tbody>
            {snapshotList.map((holder, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? "bg-gray-100 text-center dark:bg-gray-700"
                    : ""
                }
              >
                <td className="py-2 px-4 text-center border-b dark:border-gray-600">
                  {index + 1}
                </td>
                <td className="py-2 px-4 text-center border-b dark:border-gray-600">
                  {holder}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default ContactForm;
