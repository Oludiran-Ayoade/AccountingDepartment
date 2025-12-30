'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

const emailSchema = z.object({
  email: z.string().email('Must be a valid email'),
});

const resetSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/forgot-password', { email: data.email });
      
      setEmail(data.email);
      setSuccess('OTP sent to your email! Check console for OTP if SMTP not configured.');
      setTimeout(() => setStep('otp'), 2000);
    } catch (err: any) {
      // 
      // 
      
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        otp: data.otp,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });
      
      setSuccess('Password reset successful! Redirecting to sign in...');
      setTimeout(() => {
        window.location.href = '/auth?mode=login';
      }, 2000);
    } catch (err: any) {
      // 
      // 
      
      setError(err.response?.data?.error || 'Failed to reset password. Please check your OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link href="/auth" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to sign in
        </Link>

        <div className="bg-card border border-border rounded-3xl p-12 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-light text-foreground mb-2">
              {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
            </h1>
            <p className="text-muted-foreground font-light">
              {step === 'email' 
                ? 'Enter your email to receive an OTP' 
                : 'Enter the OTP sent to your email'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-light">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-light">
              {success}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              <Input
                {...emailForm.register('email')}
                label="Email"
                type="email"
                placeholder="your.email@bowen.edu.ng"
                error={emailForm.formState.errors.email?.message}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending OTP...' : 'Send OTP'}
              </Button>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
              <Input
                {...resetForm.register('otp')}
                label="OTP Code"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                error={resetForm.formState.errors.otp?.message}
              />

              <Input
                {...resetForm.register('newPassword')}
                label="New Password"
                type="password"
                placeholder="Minimum 8 characters"
                error={resetForm.formState.errors.newPassword?.message}
              />

              <Input
                {...resetForm.register('confirmPassword')}
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                error={resetForm.formState.errors.confirmPassword?.message}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm font-light text-muted-foreground hover:text-foreground transition-colors"
              >
                Didn't receive OTP? Try again
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
