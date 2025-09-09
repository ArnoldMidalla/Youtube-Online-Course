"use client";

import { GoogleButton } from "../components/googlebutton";
import { login, signup } from "./actions";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  FullName: z.string().min(2, {
    message: "Full Name must be at least 2 characters.",
  }),
  email: z.string().min(2, {
    message: "Email must be at least 2 characters.",
  }),
  Password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      FullName: "",
      Password: "",
    },
  });

  //   function onSubmit(data: z.infer<typeof FormSchema>) {
  //     toast("You submitted the following values", {
  //       description: (
  //         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
  //           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
  //         </pre>
  //       ),
  //     })
  //   }
  return (
    <section className="flex items-center justify-between px-12 pb-12 h-fit">
      <div className="flex flex-col items-center justify-center py-8 w-full">
        <div className="flex flex-col mb-4">
          <h1 className="text-3xl font-bold text-center tracking-tight">Get Started Now</h1>
          <p className="text-center text-sm font-regular">
            Enter your credentials to access your account
          </p>
        </div>
        <GoogleButton />
        <p className="py-2">- or -</p>
        <Form {...form}>
          <form className="w-120 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="arnoldmidalla" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public user name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="FullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Arnold Midalla" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="arnoldmidalla@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
      <div className="rounded-xl h-[85vh] w-[70vw] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1602803056945-ebac8ae8fd00?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
