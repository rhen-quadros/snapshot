"use client";

// Import necessary libraries and components
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getAssetsByGroup, getAssetsByCreator } from "../lib/api"; // Assuming the correct path to api.js
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
import { ScrollArea } from "./ui/scroll-area";
import Papa from "papaparse";
import { Sheet, FileJson, Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

// Define the form schema
const formSchema = z.object({
  creatorAddress: z.string(),
  traitValue: z.string().optional(),
  notListed: z.boolean().default(false).optional(),
  hashlist: z.boolean().default(false).optional(),
});

// Define the ProfileForm component
export function ProfileForm() {
  const [snapshotResult, setSnapshotResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creatorAddress: "",
      traitValue: "",
      notListed: false,
      hashlist: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Form Data:", data);

      const result = await getAssetsByGroup(
        data.creatorAddress,
        data.notListed,
        data.traitValue,
        data.hashlist
      );
      console.log("Result from getAssetsByGroup:", result);

      if (result.length === 0) {
        const creatorResult = await getAssetsByCreator(data.creatorAddress);
        setSnapshotResult(creatorResult);
        form.setValue("result", creatorResult);
        console.log("Snapshot (by creator):", creatorResult);
      } else {
        setSnapshotResult(result);
        form.setValue("result", result);
        console.log("Snapshot (by group):", result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  function countOccurrences(walletAddress) {
    // Count occurrences of the wallet address in the snapshotResult array
    return snapshotResult.filter((address) => address === walletAddress).length;
  }

  const handleDownloadCSV = () => {
    // Extract relevant data from the JSON response
    const walletAddresses = snapshotResult || [];

    // Convert data to CSV format
    const csv = Papa.unparse(
      walletAddresses.map((address) => ({ address })),
      {
        header: true,
        quotes: true,
      }
    );

    // Create a Blob and download the file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, "snapshot.csv");
    } else {
      // Other browsers
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = "snapshot.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadJSON = () => {
    const jsonData = JSON.stringify(snapshotResult, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "snpashot.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = () => {
    // Copy the entire JSON array to the clipboard
    const jsonData = JSON.stringify(snapshotResult, null, 2);
    navigator.clipboard.writeText(jsonData);
  };

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
                <FormLabel>Snapshot Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="DKS Example - 7LxjzYdvXXDMxEmjS3aBC26ut4FMtDUae44nkHBPNVWP"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  <a
                    href="https://magiceden.io/item-details/9Pqy8i6QQJqjbrkGyMVA1uLev2F7cXBjR5bY6hySdfsb?name=The-Mystic-King"
                    target="_blank"
                  >
                    The on-chain collection or the creator address -{" "}
                    <span className="underline underline-offset-4 cursor-pointer">
                      More info
                    </span>
                  </a>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* New form field for trait value */}
          <FormField
            control={form.control}
            name="traitValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trait Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Snapshot specific traits (case specific)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>For example - Bowler Hat</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center">
            <FormField
              control={form.control}
              name="notListed"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 mr-4">
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
            <FormField
              control={form.control}
              name="hashlist"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      id="terms2"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Generate Hashlist</FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Submit button */}
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center">
                <div className="h-5 w-5 border-t-2 border-b-2 border-gray-800 rounded-full animate-spin"></div>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
      {/* Display the results */}
      <div className="my-10 flex justify-between items-center">
        {/* Left side - Results */}
        <h2 className="flex items-center">Results.</h2>

        {/* Right side - Total and Buttons */}
        <div className="flex items-center">
          <div className="mr-4">
            <h3>Total: {snapshotResult ? snapshotResult.length : 0}</h3>
          </div>

          <div className="flex space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" onClick={handleDownloadCSV}>
                    <Sheet />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download as CSV</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" onClick={handleDownloadJSON}>
                    <FileJson />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download as JSON</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="outline" onClick={handleCopyToClipboard}>
                    <Copy />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <ScrollArea className="h-[500px] mx-auto rounded-md border p-4">
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
      </ScrollArea>
    </div>
  );
}

// Export the component as the default
export default ProfileForm;
