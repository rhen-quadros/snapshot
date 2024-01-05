"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

const formSchema = z.object({
  creatorAddress: z.string().min(44).max(44),
  notListed: z.boolean(),
});

export function ProfileForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creatorAddress: "",
      notListed: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const result = await getAssetsByGroup(
        data.creatorAddress,
        data.notListed
      );
      // handle result
      console.log("Unlisted Holders:", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 p-6 max-w-full"
      >
        <FormField
          control={form.control}
          name="creatorAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Creator Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="7LxjzYdvXXDMxEmjS3aBC26ut4FMtDUae44nkHBPNVWP"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

    //   <div className="mb-4">
    //     <label className="block text-gray-700 text-sm font-bold mb-2">
    //       Creator Address
    //     </label>
    //     <input
    //       type="text"
    //       id="creatorAddress"
    //       name="creatorAddress"
    //       {...register('creatorAddress')}
    //       className="appearance-none text-black border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
    //       required
    //     />
    //   </div>
    //   <div className="mb-4">
    //     <input
    //       type="checkbox"
    //       id="notListed"
    //       name="notListed"
    //       {...register('notListed')}
    //       className="mr-2 leading-tight"
    //     />
    //     <label className="text-gray-700 text-sm" htmlFor="notListed">
    //       Unlisted on marketplaces
    //     </label>
    //   </div>
    //   <div className="mb-6">
    //     <button
    //       type="submit"
    //       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    //     >
    //       Submit
    //     </button>
    //   </div>
    // </form>
  );
}

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//         <FormField
//           control={form.control}
//           name="creatorAddress"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Creator Address</FormLabel>
//               <FormControl>
//                 <Input
//                   placeholder="7LxjzYdvXXDMxEmjS3aBC26ut4FMtDUae44nkHBPNVWP"
//                   {...field}
//                 />
//               </FormControl>
//               <FormDescription>
//                 This is your public display name.
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit">Submit</Button>
//       </form>
//     </Form>
//   );
// }

export default ProfileForm;
