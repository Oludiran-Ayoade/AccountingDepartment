'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FileUpload } from '@/components/FileUpload';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showSuccess, showError } from '@/lib/toast';
import { toast } from 'react-toastify';

interface Note {
  id: string;
  title: string;
  description: string;
  course: string;
  courseCode: string;
  level: number;
  semester: string;
  lecturer: string;
  fileUrl: string;
  fileType: string;
  uploaderName: string;
  downloadCount: number;
  createdAt: string;
}

interface Course {
  code: string;
  name: string;
  level: number;
  semester: string;
}

export default function ManageNotes() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
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
    lecturer: '',
    fileUrl: '',
    fileType: 'PDF',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchNotes();
    fetchCourses();
  }, [isAuthenticated, user, router]);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data || []);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setNotes([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data || []);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setCourses([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/notes', formData);
      setSuccess('Note uploaded successfully!');
      setFormData({
        title: '',
        description: '',
        course: '',
        courseCode: '',
        level: 100,
        semester: 'first',
        lecturer: '',
        fileUrl: '',
        fileType: 'PDF',
      });
      setShowForm(false);
      fetchNotes();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmToast = toast.warning(
      <div>
        <p className="font-semibold mb-2">Delete Note?</p>
        <p className="text-sm mb-3">This action cannot be undone!</p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(confirmToast);
              try {
                await api.delete(`/notes/${id}`);
                showSuccess('Note deleted successfully!');
                fetchNotes();
              } catch (err: any) {
                showError(err.response?.data?.error || 'Failed to delete note');
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
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">Manage Notes</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} variant="primary" size="sm" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              New Note
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
              <h2 className="text-2xl font-bold text-foreground">Upload New Note</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Introduction to Financial Accounting"
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                      Level
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => {
                        const newLevel = parseInt(e.target.value);
                        setFormData({ ...formData, level: newLevel, courseCode: '', course: '' });
                      }}
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
                      onChange={(e) => {
                        setFormData({ ...formData, semester: e.target.value, courseCode: '', course: '' });
                      }}
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
                      const selectedCourse = courses.find(c => c.code === e.target.value);
                      setFormData({ 
                        ...formData, 
                        courseCode: e.target.value,
                        course: selectedCourse?.name || ''
                      });
                    }}
                    className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background transition-all duration-300"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses
                      .filter(c => c.level === formData.level && c.semester === formData.semester)
                      .map((course) => (
                        <option key={course.code} value={course.code}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-light tracking-wide uppercase mb-2 text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the note content"
                    rows={3}
                    required
                    className="w-full px-4 py-2.5 border border-border bg-background/50 text-foreground font-light rounded-xl text-sm focus:outline-none focus:border-foreground focus:bg-background placeholder:text-muted-foreground placeholder:font-light transition-all duration-300"
                  />
                </div>
                <Input
                  label="Lecturer (Optional)"
                  value={formData.lecturer}
                  onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                  placeholder="e.g., Dr. Johnson"
                />
                <FileUpload
                  onUploadSuccess={(fileUrl, fileName) => {
                    const fileExt = fileName.split('.').pop()?.toUpperCase() || 'PDF';
                    setFormData(prev => ({ ...prev, fileUrl, fileType: fileExt }));
                  }}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  folder="notes"
                  maxSize={10}
                  label="Upload Note File"
                />
                {formData.fileUrl && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <p className="text-sm text-green-600 font-medium">✓ File uploaded successfully</p>
                    <p className="text-xs text-muted-foreground mt-1">Ready to upload</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
                  <Button type="submit" variant="primary" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? 'Uploading...' : 'Upload Note'}
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
          {!notes || notes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No notes yet. Upload your first one!</p>
              </CardContent>
            </Card>
          ) : (
            notes.map((note) => (
              <Card key={note.id} hover>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                          {note.level} Level
                        </span>
                        <span className="px-2 py-1 bg-accent text-foreground text-xs font-medium rounded">
                          {note.courseCode}
                        </span>
                        <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded">
                          {note.semester === 'first' ? 'First' : 'Second'} Semester
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{note.title}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{note.course}</p>
                      <p className="text-muted-foreground mb-2">{note.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {note.lecturer && <span>Lecturer: {note.lecturer}</span>}
                        <span>{note.downloadCount} downloads</span>
                        <span>{note.fileType}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(note.id)}
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
