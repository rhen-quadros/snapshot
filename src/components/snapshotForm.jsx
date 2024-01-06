"use client";

// Import necessary libraries and components
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getAssetsByGroup } from "../lib/api";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

// Define the form schema
const formSchema = z.object({
  creatorAddress: z.string().min(44).max(44),
  notListed: z.boolean().default(false).optional(),
});

// Define the ProfileForm component
export function ProfileForm() {
  const [snapshotResult, setSanpshotResult] = useState(null);
  // Initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creatorAddress: "",
      notListed: false,
    },
  });

  // Define the form submission logic
  const onSubmit = async (data) => {
    try {
      // Fetch data based on the form input
      const result = await getAssetsByGroup(
        data.creatorAddress,
        data.notListed
      );
      setSanpshotResult(result); // Store the result in the state

      // Update the form state with the result
      form.setValue("result", result);

      // Log the result to the console
      console.log("Unlisted Holders:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function countOccurrences(walletAddress) {
    // Count occurrences of the wallet address in the snapshotResult array
    return snapshotResult.filter((address) => address === walletAddress).length;
  }

  // Render the component
  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-full"
        >
          {/* Form fields */}
          <FormField
            control={form.control}
            name="creatorAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creator Address</FormLabel>
                <FormControl>
                  <Input placeholder="On chain collection address" {...field} />
                </FormControl>
                <FormDescription>
                  <a
                    className="underline underline-offset-4 cursor-pointer"
                    href="https://magiceden.io/item-details/9Pqy8i6QQJqjbrkGyMVA1uLev2F7cXBjR5bY6hySdfsb?name=The-Mystic-King"
                    target="_blank"
                  >
                    Example here
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notListed"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    id="terms1"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Exclude NFTs listed on a marketplace.</FormLabel>
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {/* Display the results */}
      <div className="my-10 flex justify-between items-center">
        <h2 className="flex justify-between items-center">Results.</h2>
        <h3 className="flex justify-between items-center">
          Total: {snapshotResult ? snapshotResult.length : null}
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Wallet Address</TableHead>
            <TableHead className="w-[100px]">Amount Owned</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {snapshotResult &&
            snapshotResult.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{result}</TableCell>
                <TableCell>{countOccurrences(result)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* {snapshotResult && (
        <div>
          <h2>Search Results:</h2>
          <pre>{JSON.stringify(snapshotResult, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}

// Export the component as the default
export default ProfileForm;
