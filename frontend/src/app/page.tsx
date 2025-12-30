'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Vote, ArrowRight, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      title: 'Notes Library',
      description: 'Access comprehensive course materials and study resources',
      link: '/notes',
    },
    {
      title: 'Democratic Elections',
      description: 'Participate in transparent class representative elections',
      link: '/vote',
    },
    {
      title: 'Announcements',
      description: 'Stay updated with department news and events',
      link: '/announcements',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Height */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-12 animate-fade-in">
          <div className="space-y-6">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-light text-foreground tracking-tighter">
              Bowen University
            </h1>
            <div className="h-px w-24 bg-foreground mx-auto" />
            <p className="text-lg sm:text-xl text-muted-foreground font-light tracking-wide uppercase">
              Accounting Department
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/notes">
              <Button variant="primary" size="lg" className="min-w-[200px]">
                Browse Notes
              </Button>
            </Link>
            <Link href="/vote">
              <Button variant="outline" size="lg" className="min-w-[200px] bg-white text-primary border-primary hover:bg-primary hover:text-white dark:bg-background dark:text-primary dark:border-primary dark:hover:bg-primary dark:hover:text-white">
                Vote Now
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* Announcement Banner */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-accent/30 border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <Bell className="w-5 h-5 text-foreground" />
            <p className="text-sm sm:text-base text-foreground font-light">
              Class Representative elections are now open — Vote before December 31st
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="group space-y-6 hover-lift"
              >
                <div className="aspect-[4/3] bg-accent/50 rounded-sm overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
                    <span className="text-6xl font-light text-muted-foreground group-hover:text-foreground transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-light text-foreground tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-foreground group-hover:translate-x-2 transition-transform">
                    <span className="text-sm uppercase tracking-wider">Explore</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 bg-accent/20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light text-foreground tracking-tight">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              Access comprehensive study materials, participate in democratic elections, and stay connected with your department.
            </p>
          </div>
          <Link href="/auth">
            <Button variant="primary" size="lg" className="min-w-[240px]">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
