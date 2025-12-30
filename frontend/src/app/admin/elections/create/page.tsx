'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function CreateElection() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    electionType: 'general', // 'general' or 'level-based'
    targetLevel: 0,
    isOpen: false,
  });
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPosition, setCurrentPosition] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedLevel, setSelectedLevel] = useState(100);
  const [showStudents, setShowStudents] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    // Fetch students for default level (100) on mount
    fetchStudentsByLevel(100);
  }, [isAuthenticated, user, router]);

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

  const addPosition = () => {
    if (!currentPosition.trim()) {
      setError('Please enter a position title');
      return;
    }

    const newPosition: Position = {
      id: Date.now().toString(),
      title: currentPosition,
      description: '',
      level: formData.electionType === 'level-based' ? formData.targetLevel : 0,
      candidates: [],
    };

    setPositions([...positions, newPosition]);
    setCurrentPosition('');
    setError('');
  };

  const removePosition = (positionId: string) => {
    setPositions(positions.filter((p) => p.id !== positionId));
  };

  const addCandidateToPosition = (positionId: string, student: Student) => {
    const candidate: Candidate = {
      id: Date.now().toString(),
      userId: student.id,
      name: `${student.firstName} ${student.lastName}`,
      level: student.level,
      matricNumber: student.matricNumber,
      manifesto: '',
      imageUrl: '',
    };

    setPositions(
      positions.map((p) =>
        p.id === positionId ? { ...p, candidates: [...p.candidates, candidate] } : p
      )
    );
    setSuccess(`Added ${candidate.name} as candidate`);
    setTimeout(() => setSuccess(''), 2000);
  };

  const removeCandidateFromPosition = (positionId: string, candidateId: string) => {
    setPositions(
      positions.map((p) =>
        p.id === positionId
          ? { ...p, candidates: p.candidates.filter((c) => c.id !== candidateId) }
          : p
      )
    );
  };

  // Helper function to check if a student is already added as a candidate
  const isStudentSelected = (studentId: string) => {
    return positions.some((position) =>
      position.candidates.some((candidate) => candidate.userId === studentId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (positions.length === 0) {
      setError('Please add at least one position');
      setIsLoading(false);
      return;
    }

    try {
      const electionData = {
        ...formData,
        positions,
        status: formData.isOpen ? 'open' : 'upcoming',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      };

      await api.post('/elections', electionData);
      setSuccess('Election created successfully!');
      setTimeout(() => router.push('/admin/elections'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create election');
    } finally {
      setIsLoading(false);
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
            onClick={() => router.push('/admin/elections')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Elections
          </button>
          <h1 className="text-4xl font-bold text-foreground">Create New Election</h1>
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
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Class Representative Elections 2024"
                required
              />

              <div>
                <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the election"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background placeholder:text-muted-foreground placeholder:font-light transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Election Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, electionType: 'general', targetLevel: 0 })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.electionType === 'general'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <h3 className="font-bold text-foreground mb-1">General Election</h3>
                    <p className="text-sm text-muted-foreground">All levels can vote</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, electionType: 'level-based', targetLevel: 100 })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.electionType === 'level-based'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <h3 className="font-bold text-foreground mb-1">Level-Based Election</h3>
                    <p className="text-sm text-muted-foreground">Only selected level can vote</p>
                  </button>
                </div>
              </div>

              {formData.electionType === 'level-based' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Target Level
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[100, 200, 300, 400].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setFormData({ ...formData, targetLevel: level })}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          formData.targetLevel === level
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-accent text-foreground hover:bg-accent/80'
                        }`}
                      >
                        {level} Level
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isOpen"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                  className="w-5 h-5 rounded border-border"
                />
                <label htmlFor="isOpen" className="text-sm font-medium text-foreground">
                  Open election immediately after creation
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Positions */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-bold text-foreground">Positions</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                <Input
                  label=""
                  value={currentPosition}
                  onChange={(e) => setCurrentPosition(e.target.value)}
                  placeholder="e.g., Class President, Secretary, etc."
                  className="flex-1"
                />
                <Button type="button" onClick={addPosition} variant="primary" className="w-full sm:w-auto whitespace-nowrap">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Position
                </Button>
              </div>

              {positions.length > 0 && (
                <div className="space-y-4">
                  {positions.map((position) => (
                    <Card key={position.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-foreground">{position.title}</h3>
                          <button
                            type="button"
                            onClick={() => removePosition(position.id)}
                            className="text-red-500 hover:bg-red-500/10 p-1 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
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
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Select Candidates */}
          {positions.length > 0 && (
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold text-foreground">Select Candidates</h2>
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
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select a position, then click on a student to add them as a candidate
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {students.map((student) => {
                        const isSelected = isStudentSelected(student.id);
                        return (
                        <div
                          key={student.id}
                          className={`p-3 rounded-lg transition-all ${
                            isSelected 
                              ? 'bg-green-500/10 border-2 border-green-500/50' 
                              : 'bg-accent hover:bg-accent/80 border-2 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">
                                  {student.firstName} {student.lastName}
                                </h4>
                                {isSelected && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-green-600 text-white rounded-full">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{student.matricNumber}</p>
                            </div>
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  addCandidateToPosition(e.target.value, student);
                                  e.target.value = '';
                                }
                              }}
                              disabled={isSelected}
                              className={`px-3 py-1 text-sm border border-border rounded-lg ${
                                isSelected 
                                  ? 'bg-accent cursor-not-allowed opacity-50' 
                                  : 'bg-background cursor-pointer'
                              }`}
                            >
                              <option value="">{isSelected ? 'Already Added' : 'Add to...'}</option>
                              {!isSelected && positions.map((pos) => (
                                <option key={pos.id} value={pos.id}>
                                  {pos.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )})}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-4">
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Election'}
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
