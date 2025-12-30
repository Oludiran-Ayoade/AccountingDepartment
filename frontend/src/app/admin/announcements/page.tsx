'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Megaphone } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showSuccess, showError } from '@/lib/toast';
import { toast } from 'react-toastify';

interface Announcement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function ManageAnnouncements() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchAnnouncements();
  }, [isAuthenticated, user, router]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/announcements');
      setAnnouncements(response.data || []);
    } catch (err) {
      
      setAnnouncements([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/announcements', formData);
      setSuccess('Announcement created successfully!');
      setFormData({ title: '', content: '' });
      setShowForm(false);
      fetchAnnouncements();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create announcement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmToast = toast.warning(
      <div>
        <p className="font-semibold mb-2">Delete Announcement?</p>
        <p className="text-sm mb-3">This action cannot be undone!</p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(confirmToast);
              try {
                await api.delete(`/announcements/${id}`);
                showSuccess('Announcement deleted successfully!');
                fetchAnnouncements();
              } catch (err: any) {
                showError(err.response?.data?.error || 'Failed to delete announcement');
              }
            }}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)}
            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        draggable: false,
      }
    );
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Megaphone className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Manage Announcements</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} variant="primary" size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
            {success}
          </div>
        )}

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">Create New Announcement</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter announcement title"
                  required
                />
                <div>
                  <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Enter announcement content"
                    rows={6}
                    required
                    className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background placeholder:text-muted-foreground placeholder:font-light transition-all duration-300"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                  <Button type="submit" variant="primary" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? 'Creating...' : 'Create Announcement'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {!announcements || announcements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Megaphone className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No announcements yet. Create your first one!</p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} hover>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">{announcement.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 whitespace-pre-wrap break-words">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(announcement.id)}
                      className="self-end sm:self-start p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
