import { Metadata } from "next";
import Link from "next/link";
import ForgotPasswordForm from "@/components/forms/forgot-password-form";

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
            Reset Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive password reset instructions.
          </p>
        </div>
        <ForgotPasswordForm />
        {/* Back to Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Remembered your password?{" "}
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
