'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, Vote, Users, TrendingUp, Plus, FileText, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalDownloads: 0,
    totalUsers: 0,
    activeElections: 0,
  });
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [activeElectionsList, setActiveElectionsList] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }

    // Fetch real stats from API
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        setStats({
          totalNotes: response.data.totalNotes || 0,
          totalDownloads: response.data.totalDownloads || 0,
          totalUsers: response.data.totalUsers || 0,
          activeElections: response.data.activeElections || 0,
        });
        setRecentNotes(response.data.recentNotes || []);
        setActiveElectionsList(response.data.activeElectionsList || []);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const statCards = [
    {
      title: 'Total Notes',
      value: stats.totalNotes,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Total Downloads',
      value: stats.totalDownloads,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Registered Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Active Elections',
      value: stats.activeElections,
      icon: Vote,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const quickActions = [
    {
      title: 'Manage Students',
      description: 'View and manage all registered students',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      action: () => router.push('/admin/students'),
    },
    {
      title: 'Manage Announcements',
      description: 'Create and manage department announcements',
      icon: FileText,
      color: 'from-green-500 to-emerald-500',
      action: () => router.push('/admin/announcements'),
    },
    {
      title: 'Manage Elections',
      description: 'Set up elections and select candidates by level',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      action: () => router.push('/admin/elections'),
    },
    {
      title: 'Manage Past Questions',
      description: 'Upload past questions for students',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      action: () => router.push('/admin/past-questions'),
    },
    {
      title: 'Manage Notes',
      description: 'Upload and manage course notes',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-500',
      action: () => router.push('/admin/notes'),
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <LayoutDashboard className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName}! Manage your department portal.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm text-muted-foreground mb-1">{stat.title}</h3>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div key={index} onClick={action.action} className="cursor-pointer">
                  <Card hover>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notes */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-foreground">Recent Notes</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentNotes.length > 0 ? (
                  recentNotes.map((note, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent">
                      <div>
                        <h4 className="font-semibold text-foreground">{note.title}</h4>
                        <p className="text-sm text-muted-foreground">{note.courseCode}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{note.downloadCount || 0}</p>
                        <p className="text-xs text-muted-foreground">downloads</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No notes available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Elections */}
          <Card>
            <CardHeader>
              <h3 className="text-xl font-bold text-foreground">Active Elections</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeElectionsList.length > 0 ? (
                  activeElectionsList.map((election, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-accent">
                      <div>
                        <h4 className="font-semibold text-foreground">{election.title}</h4>
                        <p className="text-sm text-muted-foreground">{election.positions?.length || 0} positions</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{election.voteCount || 0}</p>
                        <p className="text-xs text-muted-foreground">votes cast</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No active elections</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
