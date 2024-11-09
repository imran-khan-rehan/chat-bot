"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
import GithubSignInButton from "../github-auth-button";
import { loginUser } from "@/services/authService";


// Extend the schema to include the password field
const formSchema = z.object({
  username: z.string().nonempty({ message: "Provide a username" }), // nonempty is used for required fields
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters" }), // corrected to 3 characters
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // For displaying error messages
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  const defaultValues = {
    username: "demo@gmail.com",
    password: "", // Default value for password
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    setLoading(true);
    setError(""); // Clear any previous errors

    try {
      // Backend request
      console.log(data);
      const response = await loginUser(data);
      console.log("Login successful, response:", response.access_token);

      // Store username and token in localStorage (or sessionStorage)
      localStorage.setItem("token", response.access_token);
      const userId = response.user_id;
      if (userId !== null) {
        localStorage.setItem("url",  `localhost:3000/user/${userId}`);
      }
      // localStorage.setItem("", data.username);
      
      // Next-auth sign-in flow (if you are using next-auth for managing authentication)
      const user = await signIn("credentials", {
        email: data.username,
        password: data.password, // Send the password as part of the form
        callbackUrl: callbackUrl ?? "/dashboard", // Default redirect after login
      });

      //console.log("Signed in user:", user);
    } catch (error: any) {
      console.log("Login error:", error.detail);
      setError(error.detail || "Invalid login credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          {/* username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your username..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"} // Toggle visibility
                      placeholder="Enter your password..."
                      disabled={loading}
                      {...field}
                    />
                    {/* Eye Icon for toggling password visibility */}
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Continue With Username
          </Button>

          {/* Error Message Display */}
          {error && (
            <div className="text-red-600 mt-2 text-center">{error}</div>
          )}
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <GithubSignInButton />

      {/* Signup and Forgot Password Links */}
      <div className="mt-4 flex justify-between">
        <Button
          variant="ghost"
          onClick={() => {
            // Redirect to signup page
            window.location.href = "/signup";
          }}
          disabled={loading}
        >
          Sign Up
        </Button>
        {/* <Button
          variant="ghost"
          onClick={() => {
            // Redirect to forgot password page
            window.location.href = "/forgot-password";
          }}
          disabled={loading}
        >
          Forgot Password?
        </Button> */}
      </div>
    </>
  );
}
