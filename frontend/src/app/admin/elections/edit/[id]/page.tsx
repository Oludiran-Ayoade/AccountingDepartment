'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  matricNumber: string;
  level: number;
}

interface Candidate {
  id: string;
  userId: string;
  name: string;
  level: number;
  matricNumber: string;
  manifesto: string;
  imageUrl: string;
}

interface Position {
  id: string;
  title: string;
  description: string;
  level: number;
  candidates: Candidate[];
}

interface Election {
  id: string;
  title: string;
  description: string;
  electionType: string;
  targetLevel: number;
  isOpen: boolean;
  positions: Position[];
}

export default function EditElection() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const electionId = params.id as string;
  
  const [election, setElection] = useState<Election | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(100);
  const [showStudents, setShowStudents] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchElection();
  }, [isAuthenticated, user, router, electionId]);

  const fetchElection = async () => {
    try {
      const response = await api.get(`/elections/${electionId}`);
      setElection(response.data);
    } catch (err) {
      console.error('Failed to fetch election:', err);
      setError('Failed to load election');
    } finally {
      setIsLoading(false);
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

  const addCandidateToPosition = (positionId: string, student: Student) => {
    if (!election) return;

    const candidate: Candidate = {
      id: Date.now().toString(),
      userId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      level: student.level,
      matricNumber: student.matricNumber,
      manifesto: '',
      imageUrl: '',
    };

    const updatedPositions = election.positions.map((p) =>
      p.id === positionId ? { ...p, candidates: [...p.candidates, candidate] } : p
    );

    setElection({ ...election, positions: updatedPositions });
    setSuccess(`Added ${candidate.name} as candidate`);
    setTimeout(() => setSuccess(''), 2000);
  };

  const removeCandidateFromPosition = (positionId: string, candidateId: string) => {
    if (!election) return;

    const updatedPositions = election.positions.map((p) =>
      p.id === positionId
        ? { ...p, candidates: p.candidates.filter((c) => c.id !== candidateId) }
        : p
    );

    setElection({ ...election, positions: updatedPositions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!election) return;

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      await api.put(`/elections/${electionId}`, election);
      setSuccess('Election updated successfully!');
      setTimeout(() => router.push('/admin/elections'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update election');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  if (isLoading || !election) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/elections')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Elections
          </button>
          <h1 className="text-4xl font-bold text-foreground">Edit Election</h1>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Election Details */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">Election Details</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Election Title"
                value={election.title}
                onChange={(e) => setElection({ ...election, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={election.description}
                  onChange={(e) => setElection({ ...election, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background transition-all duration-300"
                />
              </div>
            </CardContent>
          </Card>

          {/* Positions and Candidates */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">Positions & Candidates</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              {election.positions.map((position) => (
                <Card key={position.id}>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-foreground mb-3">{position.title}</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Candidates: {position.candidates.length}
                      </p>
                      {position.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center justify-between p-2 bg-accent rounded"
                        >
                          <span className="text-sm">
                            {candidate.name} ({candidate.matricNumber})
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCandidateFromPosition(position.id, candidate.id)}
                            className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Add Candidates */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">Add More Candidates</h2>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Level to View Students
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[100, 200, 300, 400].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        setSelectedLevel(level);
                        fetchStudentsByLevel(level);
                      }}
                      className={`px-4 py-3 rounded-xl font-medium transition-all ${
                        selectedLevel === level
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-foreground hover:bg-accent/80'
                      }`}
                    >
                      {level} Level
                    </button>
                  ))}
                </div>
              </div>

              {showStudents && students.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="p-3 bg-accent rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-sm text-muted-foreground">{student.matricNumber}</p>
                        </div>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              addCandidateToPosition(e.target.value, student);
                              e.target.value = '';
                            }
                          }}
                          className="px-3 py-1 text-sm border border-border rounded-lg bg-background"
                        >
                          <option value="">Add to...</option>
                          {election.positions.map((pos) => (
                            <option key={pos.id} value={pos.id}>
                              {pos.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/elections')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
