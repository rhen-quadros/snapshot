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
  creatorAddress: z.string().min(44).max(44),
  notListed: z.boolean().default(false).optional(),
});

// Define the ProfileForm component
export function ProfileForm() {
  const [snapshotResult, setSnapshotResult] = useState(null);
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
      setSnapshotResult(result); // Store the result in the state

      // Update the form state with the result
      form.setValue("result", result);

      // Log the result to the console
      console.log("Snapshot:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
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
                <FormLabel>Collection Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="DKS Example - 7LxjzYdvXXDMxEmjS3aBC26ut4FMtDUae44nkHBPNVWP"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  <a
                    className="underline underline-offset-4 cursor-pointer"
                    href="https://magiceden.io/item-details/9Pqy8i6QQJqjbrkGyMVA1uLev2F7cXBjR5bY6hySdfsb?name=The-Mystic-King"
                    target="_blank"
                  >
                    More info
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
