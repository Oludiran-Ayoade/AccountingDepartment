'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/FileUpload';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showSuccess, showError } from '@/lib/toast';
import { toast } from 'react-toastify';

interface PastQuestion {
  id: string;
  title: string;
  description: string;
  course: string;
  courseCode: string;
  level: number;
  semester: string;
  year: number;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}

interface Course {
  code: string;
  name: string;
  level: number;
  semester: string;
}

export default function ManagePastQuestions() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course: '',
    courseCode: '',
    level: 100,
    semester: 'first',
    year: new Date().getFullYear(),
    fileUrl: '',
    fileName: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchPastQuestions();
    fetchCourses();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    const filtered = courses.filter(
      (c) => c.level === formData.level && c.semester === formData.semester
    );
    setFilteredCourses(filtered);
  }, [formData.level, formData.semester, courses]);

  const fetchPastQuestions = async () => {
    try {
      const response = await api.get('/past-questions');
      setPastQuestions(response.data || []);
    } catch (err) {
      setPastQuestions([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate file upload
    if (!formData.fileUrl || !formData.fileName) {
      setError('Please upload a PDF file before submitting');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting past question with data:', formData);
      await api.post('/past-questions', formData);
      setSuccess('Past question uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        course: '',
        courseCode: '',
        level: 100,
        semester: 'first',
        year: new Date().getFullYear(),
        fileUrl: '',
        fileName: '',
      });
      setShowForm(false);
      fetchPastQuestions();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload past question');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmToast = toast.warning(
      <div>
        <p className="font-semibold mb-2">Delete Past Question?</p>
        <p className="text-sm mb-3">This action cannot be undone!</p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(confirmToast);
              try {
                await api.delete(`/past-questions/${id}`);
                showSuccess('Past question deleted successfully!');
                fetchPastQuestions();
              } catch (err: any) {
                showError(err.response?.data?.error || 'Failed to delete past question');
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
            className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Manage Past Questions</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} variant="primary" size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Past Question
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
              <h2 className="text-2xl font-bold text-foreground">Upload Past Question</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Financial Accounting Final Exam"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value), course: '', courseCode: '' })}
                      className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background transition-all duration-300"
                      required
                    >
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                      Semester
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value, course: '', courseCode: '' })}
                      className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background transition-all duration-300"
                      required
                    >
                      <option value="first">First Semester</option>
                      <option value="second">Second Semester</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                    Course
                  </label>
                  <select
                    value={formData.courseCode}
                    onChange={(e) => {
                      const selectedCourse = filteredCourses.find(c => c.code === e.target.value);
                      if (selectedCourse) {
                        setFormData({ 
                          ...formData, 
                          courseCode: selectedCourse.code,
                          course: selectedCourse.name
                        });
                      }
                    }}
                    className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background transition-all duration-300"
                    required
                  >
                    <option value="">Select a course</option>
                    {filteredCourses.map((course) => (
                      <option key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                  placeholder="2024"
                  required
                />
                <div>
                  <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Additional details about this past question"
                    rows={3}
                    className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background placeholder:text-muted-foreground placeholder:font-light transition-all duration-300"
                  />
                </div>
                <FileUpload
                  onUploadSuccess={(fileUrl, fileName) => {
                    setFormData(prev => ({ ...prev, fileUrl, fileName }));
                  }}
                  accept=".pdf"
                  folder="past-questions"
                  maxSize={10}
                  label="Upload Past Question PDF"
                />
                {formData.fileUrl && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-sm text-green-600 font-medium">✓ File uploaded successfully</p>
                    <p className="text-xs text-muted-foreground mt-1">{formData.fileName}</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isLoading || !formData.fileUrl || !formData.fileName} 
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Uploading...' : !formData.fileUrl ? 'Upload PDF First' : 'Upload Past Question'}
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
          {!pastQuestions || pastQuestions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No past questions yet. Upload your first one!</p>
              </CardContent>
            </Card>
          ) : (
            pastQuestions.map((pq) => (
              <Card key={pq.id} hover>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                          {pq.level} Level
                        </span>
                        <span className="px-2 py-1 bg-accent text-foreground text-xs font-medium rounded">
                          {pq.courseCode}
                        </span>
                        <span className="px-2 py-1 bg-muted text-foreground text-xs font-medium rounded">
                          {pq.semester === 'first' ? 'First' : 'Second'} Semester
                        </span>
                        <span className="text-xs text-muted-foreground">{pq.year}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{pq.title}</h3>
                      {pq.description && (
                        <p className="text-muted-foreground mb-2">{pq.description}</p>
                      )}
                      <p className="text-sm text-muted-foreground">File: {pq.fileName}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(pq.id)}
                      className="ml-4 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
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
