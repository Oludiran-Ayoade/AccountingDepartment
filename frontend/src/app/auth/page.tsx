'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const loginSchema = z.object({
  email: z.string().email('Must be a valid email'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Must be a valid email'),
  matricNo: z.string()
    .regex(/^BU\d{2}ACC\d{4}$/, 'Matric number must be in format: BU23ACC1010')
    .min(11, 'Matric number must be 11 characters')
    .max(11, 'Matric number must be 11 characters'),
  phoneNumber: z.string()
    .regex(/^\+?[0-9]{10,14}$/, 'Phone number must be 10-14 digits')
    .min(10, 'Phone number must be at least 10 digits'),
  level: z.number().min(100).max(400),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', data);

      if (response.data.token && response.data.user) {
        setAuth(response.data.user, response.data.token);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Split fullName into firstName and lastName
    const nameParts = data.fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0];

    const payload = {
      firstName: firstName,
      lastName: lastName,
      email: data.email,
      matricNumber: data.matricNo,
      phoneNumber: data.phoneNumber,
      level: data.level,
      password: data.password,
    };

    try {
      const response = await api.post('/auth/register', payload);
      
      if (response.data.token && response.data.user) {
        setAuth(response.data.user, response.data.token);
        router.push('/');
      } else {
        setSuccess('Registration successful! Please sign in.');
        setTimeout(() => {
          setIsLogin(true);
          loginForm.setValue('email', data.email);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </Link>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Form */}
            <div className="p-8 lg:p-10">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-foreground mb-1">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-sm text-muted-foreground font-light">
                  {isLogin ? 'Sign in to continue' : 'Join the Bowen Accounting community'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-xs font-light">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-xs font-light">
                  {success}
                </div>
              )}

              {isLogin ? (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <Input
                    {...loginForm.register('email')}
                    label="Email"
                    type="email"
                    placeholder="your.email@bowen.edu.ng"
                    error={loginForm.formState.errors.email?.message}
                  />

                  <div className="relative">
                    <Input
                      {...loginForm.register('password')}
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      error={loginForm.formState.errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-border" />
                      <span className="text-muted-foreground font-light">Remember me</span>
                    </label>
                    <Link href="/auth/forgot-password" className="text-foreground hover:opacity-70 transition-opacity font-light">
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              ) : (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <Input
                    {...registerForm.register('fullName')}
                    label="Full Name"
                    type="text"
                    placeholder="Enter your full name"
                    error={registerForm.formState.errors.fullName?.message}
                  />

                  <Input
                    {...registerForm.register('email')}
                    label="Email"
                    type="email"
                    placeholder="your.email@bowen.edu.ng"
                    error={registerForm.formState.errors.email?.message}
                  />

                  <div>
                    <Input
                      {...registerForm.register('matricNo', {
                        onChange: (e) => {
                          e.target.value = e.target.value.toUpperCase();
                        }
                      })}
                      label="Matric Number"
                      type="text"
                      placeholder="BU24ACC1234"
                      maxLength={11}
                      error={registerForm.formState.errors.matricNo?.message}
                      className="font-mono"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Format: BU[Year]ACC[4-digit number] (e.g., BU23ACC1234)</p>
                  </div>

                  <Input
                    {...registerForm.register('phoneNumber')}
                    label="Phone Number"
                    type="tel"
                    placeholder="08012345678"
                    error={registerForm.formState.errors.phoneNumber?.message}
                  />

                  <div className="w-full">
                    <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                      Level
                    </label>
                    <select
                      {...registerForm.register('level', { valueAsNumber: true })}
                      className={`w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background transition-all duration-300 ${
                        registerForm.formState.errors.level ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                    >
                      <option value="">Select your level</option>
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                    </select>
                    {registerForm.formState.errors.level && (
                      <p className="mt-1 text-xs font-light text-red-500">
                        {registerForm.formState.errors.level.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerForm.register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimum 8 characters"
                        className={`w-full px-4 py-2.5 pr-10 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background placeholder:text-muted-foreground placeholder:font-light transition-all duration-300 ${
                          registerForm.formState.errors.password ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="mt-1 text-xs font-light text-red-500">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full">
                    <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        {...registerForm.register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Re-enter your password"
                        className={`w-full px-4 py-2.5 pr-10 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background placeholder:text-muted-foreground placeholder:font-light transition-all duration-300 ${
                          registerForm.formState.errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="mt-1 text-xs font-light text-red-500">
                        {registerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              )}

              <div className="mt-6 text-center">
                <button
                  onClick={toggleMode}
                  className="text-xs font-light text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isLogin ? (
                    <>Don't have an account? <span className="text-foreground font-normal">Sign up</span></>
                  ) : (
                    <>Already have an account? <span className="text-foreground font-normal">Sign in</span></>
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden md:flex bg-gradient-to-br from-primary/10 to-accent/30 p-8 items-center justify-center relative overflow-hidden">
              <div className="relative z-10 text-center space-y-4">
                <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center">
                  <span className="text-3xl font-light text-primary-foreground">BU</span>
                </div>
                <h2 className="text-2xl font-light text-foreground">
                  Bowen University
                </h2>
                <p className="text-xs text-muted-foreground font-light uppercase tracking-wide">
                  Accounting Department
                </p>
                <p className="text-muted-foreground font-light max-w-xs text-xs">
                  Access notes, participate in elections, and stay connected
                </p>
                <div className="flex items-center justify-center space-x-1 pt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                </div>
              </div>
              
              {/* Decorative circles */}
              <div className="absolute top-10 right-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
