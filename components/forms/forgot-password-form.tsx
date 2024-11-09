'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Forgot Password Schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

type ForgotPasswordFormValue = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const defaultValues = {
    email: ''
  };

  const form = useForm<ForgotPasswordFormValue>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues
  });

  const onSubmit = async (data: ForgotPasswordFormValue) => {
    setLoading(true);
    // Simulate an API call for password reset
    try {
      console.log('Password reset link sent to:', data.email);
      alert('Password reset link sent to your email');
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
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="ml-auto w-full" type="submit">
            Send Password Reset Link
          </Button>
        </form>
      </Form>
    </>
  );
}
