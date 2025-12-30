'use client';

import React, { useEffect, useState } from 'react';
import { User, Mail, Hash, Download, Vote, Calendar, Award, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { ProfilePictureUpload } from '@/components/ProfilePictureUpload';
import api from '@/lib/api';

interface DownloadHistory {
  id: string;
  noteTitle: string;
  course: string;
  downloadDate: string;
}

interface VoteHistory {
  id: string;
  electionTitle: string;
  position: string;
  voteDate: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);
  const [voteHistory, setVoteHistory] = useState<VoteHistory[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    // Fetch real download and vote history from API
    const fetchHistory = async () => {
      if (!user) return;
      
      try {
        // Fetch download history
        const downloadsResponse = await api.get(`/note-downloads/user/${user.id}`);
        setDownloadHistory(downloadsResponse.data || []);
        
        // Fetch vote history
        const votesResponse = await api.get(`/votes/user/${user.id}`);
        setVoteHistory(votesResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        setDownloadHistory([]);
        setVoteHistory([]);
      }
    };
    
    fetchHistory();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Profile</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="text-center">
                  <ProfilePictureUpload
                    currentImage={user.profilePicture}
                    userName={`${user.firstName} ${user.lastName}`}
                    onUploadSuccess={(imageUrl) => {
                      // Update user in auth store
                      user.profilePicture = imageUrl;
                    }}
                  />
                  <h2 className="text-2xl font-bold text-foreground mb-1 mt-4">
                    {user.firstName} {user.lastName}
                  </h2>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {user.role === 'admin' ? 'Administrator' : 'Student'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-muted-foreground">
                    <Hash className="w-5 h-5" />
                    <span className="text-sm">{user.matricNumber}</span>
                  </div>
                  {user.phoneNumber && user.phoneNumber !== '0' && (
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <Phone className="w-5 h-5" />
                      <span className="text-sm">{user.phoneNumber}</span>
                    </div>
                  )}
                  {user.level && (
                    <div className="flex items-center space-x-3 text-muted-foreground">
                      <Award className="w-5 h-5" />
                      <span className="text-sm">{user.level} Level</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground">Activity Stats</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Download className="w-5 h-5 text-primary" />
                      <span className="text-muted-foreground">Downloads</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{downloadHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Vote className="w-5 h-5 text-purple-500" />
                      <span className="text-muted-foreground">Votes Cast</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{voteHistory.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity History */}
          <div className="lg:col-span-2 space-y-8">
            {/* Download History */}
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold text-foreground">Download History</h3>
              </CardHeader>
              <CardContent>
                {downloadHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Download className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No downloads yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {downloadHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
                      >
                        <div>
                          <h4 className="font-semibold text-foreground">{item.noteTitle}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground">{item.course}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(item.downloadDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vote History */}
            <Card>
              <CardHeader>
                <h3 className="text-2xl font-bold text-foreground">Voting History</h3>
              </CardHeader>
              <CardContent>
                {voteHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Vote className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No votes cast yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {voteHistory.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-accent"
                      >
                        <div>
                          <h4 className="font-semibold text-foreground">{item.electionTitle}</h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-muted-foreground">Position: {item.position}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(item.voteDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-green-500">
                          <Award className="w-5 h-5" />
                          <span className="text-sm font-medium">Voted</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
