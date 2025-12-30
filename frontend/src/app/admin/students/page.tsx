'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string;
  level: number;
  profilePicture?: string;
  createdAt: string;
}

export default function ManageStudents() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchStudents();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedLevel, students]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/students');
      setStudents(response.data || []);
      setFilteredStudents(response.data || []);
    } catch (err) {
      
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.matricNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLevel) {
      filtered = filtered.filter((student) => student.level === selectedLevel);
    }

    setFilteredStudents(filtered);
  };

  const getStudentCountByLevel = (level: number) => {
    return students.filter((s) => s.level === level).length;
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Manage Students</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage all registered students ({students.length} total)
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[100, 200, 300, 400].map((level) => (
            <Card key={level} hover>
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{level} Level</p>
                  <p className="text-3xl font-bold text-foreground">{getStudentCountByLevel(level)}</p>
                  <p className="text-xs text-muted-foreground">students</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Search className="w-4 h-4 inline mr-2" />
                  Search Students
                </label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, matric number, or email..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Filter className="w-4 h-4 inline mr-2" />
                  Filter by Level
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedLevel(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedLevel === null
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-foreground hover:bg-accent/80'
                    }`}
                  >
                    All
                  </button>
                  {[100, 200, 300, 400].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === level
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-accent text-foreground hover:bg-accent/80'
                      }`}
                    >
                      {level}L
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedLevel
                  ? 'Try adjusting your filters'
                  : 'No students registered yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} hover>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {student.profilePicture ? (
                        <img
                          src={student.profilePicture}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        `${student.firstName[0]}${student.lastName[0]}`
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-lg truncate">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{student.email}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                          {student.level} Level
                        </span>
                        <span className="text-xs text-muted-foreground">{student.matricNumber}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
