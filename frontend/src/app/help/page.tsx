'use client';

import React from 'react';
import { HelpCircle, BookOpen, Vote, Upload, Download, Shield, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function HelpPage() {
  const faqs = [
    {
      question: 'How do I access course notes and past questions?',
      answer: 'Navigate to the Notes Library or Past Questions page from the main menu. Browse by level and semester, or use the search bar to find specific courses. Click on any course to view available materials.',
    },
    {
      question: 'How do I download materials?',
      answer: 'Click the "Preview" button to view the PDF in your browser, or click "Download" to save it to your device. You must be logged in with your Bowen University account to access materials.',
    },
    {
      question: 'How do I participate in elections?',
      answer: 'Go to the Vote page during active election periods. Review candidate profiles and manifestos, then select your preferred candidate and confirm your vote. Each student can vote once per election.',
    },
    {
      question: 'Can I change my vote after submitting?',
      answer: 'No, all votes are final and cannot be changed once submitted. The system ensures election integrity by preventing vote modifications.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Click on your profile icon in the navigation bar and select "Profile". You can update your phone number, profile picture, and other personal details from there.',
    },
    {
      question: 'What file formats are supported for uploads?',
      answer: 'The platform supports PDF files for notes and past questions. Profile pictures support JPG, PNG, and WEBP formats.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page and enter your Bowen University email. Follow the instructions sent to your email to create a new password.',
    },
    {
      question: 'Who can upload notes and past questions?',
      answer: 'Only department administrators and authorized staff can upload materials. This ensures quality control and accuracy of academic content.',
    },
  ];

  const guides = [
    {
      icon: BookOpen,
      title: 'Using the Notes Library',
      description: 'Learn how to search, filter, and download course materials effectively.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Vote,
      title: 'Voting in Elections',
      description: 'Step-by-step guide to participating in class representative elections.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Upload,
      title: 'Contributing Notes',
      description: 'Guidelines for sharing your notes with the community (Admin only).',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Understand how we protect your data and maintain election integrity.',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold text-foreground mb-2">Help & Support</h1>
          <p className="text-xl text-muted-foreground">
            Find answers to common questions and learn how to use the platform
          </p>
        </div>

        {/* Quick Guides */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Quick Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <Card key={index} hover className="text-center">
                  <CardHeader>
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${guide.color} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{guide.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <h3 className="text-lg font-bold text-foreground">{faq.question}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
