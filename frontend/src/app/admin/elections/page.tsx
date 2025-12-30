'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string;
  level: number;
}

interface Election {
  id: string;
  title: string;
  description: string;
  status: string;
  isOpen: boolean;
  electionType: string;
  targetLevel: number;
  startDate: string;
  endDate: string;
  positions: any[];
}

export default function ManageElections() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number>(100);
  const [showStudents, setShowStudents] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchElections();
  }, [isAuthenticated, user, router]);

  const fetchElections = async () => {
    try {
      const response = await api.get('/elections');
      setElections(response.data || []);
    } catch (err) {
      
      setElections([]);
    }
  };

  const fetchStudentsByLevel = async (level: number) => {
    try {
      const response = await api.get(`/users/students?level=${level}`);
      setStudents(response.data || []);
      setShowStudents(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch students');
      setStudents([]);
    }
  };

  const handleLevelChange = (level: number) => {
    setSelectedLevel(level);
    fetchStudentsByLevel(level);
  };

  const toggleElection = async (electionId: string, currentStatus: boolean) => {
    try {
      await api.put(`/elections/${electionId}/toggle`, { isOpen: !currentStatus });
      setSuccess(`Election ${!currentStatus ? 'opened' : 'closed'} successfully`);
      fetchElections();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to toggle election');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Manage Elections</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Create elections and select candidates from students by level
          </p>
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

        <div>
          {/* Active Elections */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Active Elections</h2>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => router.push('/admin/elections/create')}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Election
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!elections || elections.length === 0 ? (
                    <div className="text-center py-8">
                      <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No elections yet</p>
                    </div>
                  ) : (
                    elections.map((election) => (
                      <div
                        key={election.id}
                        className="p-3 sm:p-4 bg-accent rounded-lg transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{election.title}</h3>
                              <p className="text-xs sm:text-sm text-muted-foreground mb-2 break-words">
                                {election.description}
                              </p>
                              <div className="flex items-center space-x-2 flex-wrap gap-2">
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded ${
                                    election.isOpen
                                      ? 'bg-green-500/10 text-green-600'
                                      : 'bg-gray-500/10 text-gray-600'
                                  }`}
                                >
                                  {election.isOpen ? 'Open' : 'Closed'}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium rounded bg-blue-500/10 text-blue-600">
                                  {election.electionType === 'general' ? 'General' : `${election.targetLevel} Level`}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {election.positions?.length || 0} positions
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-border">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs sm:text-sm text-muted-foreground">Status:</span>
                              <button
                                onClick={() => toggleElection(election.id, election.isOpen)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  election.isOpen ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    election.isOpen ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                              <span className="text-xs sm:text-sm font-medium text-foreground">
                                {election.isOpen ? 'Open' : 'Closed'}
                              </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/elections/${election.id}`)}
                                className="w-full sm:w-auto"
                              >
                                View Results
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.push(`/admin/elections/edit/${election.id}`)}
                                className="w-full sm:w-auto"
                              >
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="mt-6">
              <CardHeader>
                <h3 className="text-lg font-bold text-foreground">How to Create Elections</h3>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">1.</span>
                    Click "Create Election" button above
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">2.</span>
                    Choose election type: General (all levels) or Level-Based (specific level)
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">3.</span>
                    Add positions (e.g., President, Secretary, Treasurer)
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">4.</span>
                    Select level to view students, then add them as candidates to positions
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold text-primary mr-2">5.</span>
                    Toggle elections open/closed using the switch above
                  </li>
                </ol>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
