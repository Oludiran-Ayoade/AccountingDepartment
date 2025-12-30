'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatRelativeTime } from '@/lib/utils';
import api from '@/lib/api';

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
    } catch (err) {
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Megaphone className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Announcements</h1>
          </div>
          <p className="text-muted-foreground">Stay updated with department news and events</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Megaphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No announcements yet</h3>
              <p className="text-muted-foreground">Check back later for updates</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} hover>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{announcement.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
