'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Vote, ArrowRight, Bell, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setIsLoadingAnnouncements(true);
      const response = await api.get('/announcements');
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      setAnnouncements([]);
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  const nextAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => 
      prev === announcements.length - 1 ? 0 : prev + 1
    );
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => 
      prev === 0 ? announcements.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(nextAnnouncement, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

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
          {isLoadingAnnouncements ? (
            <div className="flex items-center justify-center space-x-4">
              <Bell className="w-5 h-5 text-foreground animate-pulse" />
              <p className="text-sm sm:text-base text-foreground font-light">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex items-center justify-center space-x-4">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm sm:text-base text-muted-foreground font-light">No announcements at this time</p>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              {announcements.length > 1 && (
                <button
                  onClick={prevAnnouncement}
                  className="absolute left-0 p-2 hover:bg-accent/50 rounded-full transition-colors"
                  aria-label="Previous announcement"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
              )}
              <div className="flex items-center justify-center space-x-4 px-12">
                <Bell className="w-5 h-5 text-foreground flex-shrink-0" />
                <div className="text-center">
                  <p className="text-sm sm:text-base text-foreground font-semibold mb-1">
                    {announcements[currentAnnouncementIndex].title}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground font-light">
                    {announcements[currentAnnouncementIndex].content}
                  </p>
                </div>
              </div>
              {announcements.length > 1 && (
                <button
                  onClick={nextAnnouncement}
                  className="absolute right-0 p-2 hover:bg-accent/50 rounded-full transition-colors"
                  aria-label="Next announcement"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              )}
            </div>
          )}
          {announcements.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {announcements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentAnnouncementIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentAnnouncementIndex
                      ? 'bg-foreground w-6'
                      : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                  }`}
                  aria-label={`Go to announcement ${index + 1}`}
                />
              ))}
            </div>
          )}
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
