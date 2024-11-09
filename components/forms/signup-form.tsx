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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // To navigate after signup
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
import { signupUser } from "../../services/authService";
import * as z from "zod";

// Signup Schema
const signupSchema = z
  .object({
    username: z.string().email({ message: "Enter a valid username" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Confirm password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormValue = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility
  const router = useRouter(); // For redirection

  const defaultValues = {
    username: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm<SignupFormValue>({
    resolver: zodResolver(signupSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleInputChange = () => {
    setError(""); // Clear error when input changes
  };

  const onSubmit = async (data: SignupFormValue) => {
    setLoading(true);
    setError(""); // Clear any previous error before new request
    try {
      console.log("Sign up with username and password:", data);
      const { confirmPassword, ...trimData } = data;
      console.log(trimData);
      const response = await signupUser(trimData);
      console.log("response is", response);
      alert("Account created successfully");

      // Redirect to /login after successful signup
      router.push("/login");
    } catch (error: any) {
      console.log("error from form is", error);
      setError(error.detail || "Something went wrong, please try again.");
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
                    onChange={(e) => {
                      field.onChange(e);
                      handleInputChange();
                    }}
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
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"} // Toggle visibility
                      placeholder="Confirm your password..."
                      disabled={loading}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange();
                      }}
                    />
                    {/* Eye Icon for toggling confirm password visibility */}
                    <div
                      className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Sign Up
          </Button>

          {/* Error Message Display */}
          {error && (
            <div className="text-red-600 mt-2 text-center">{error}</div>
          )}
        </form>
      </Form>
    </>
  );
}
