import { Metadata } from "next";
import Link from "next/link";
import SignupForm from "@/components/forms/signup-form";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] md:w-[600px] lg:w-[700px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Please provide the necessary information to sign up.
          </p>
        </div>
        <SignupForm />
        {/* Back to Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/"
              className="underline underline-offset-4 hover:text-primary"
            >
              Return to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
