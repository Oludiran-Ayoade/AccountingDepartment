'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download, Search, BookOpen, ChevronDown, ChevronUp, Calendar, X, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PdfViewer } from '@/components/PdfViewer';
import api from '@/lib/api';

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

export default function PastQuestionsPage() {
  const [pastQuestions, setPastQuestions] = useState<PastQuestion[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [coursePastQuestions, setCoursePastQuestions] = useState<PastQuestion[]>([]);
  const [isLoadingPastQuestions, setIsLoadingPastQuestions] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<{[key: number]: boolean}>({
    100: true,
    200: false,
    300: false,
    400: false,
  });
  const [viewingPdf, setViewingPdf] = useState<{url: string, name: string} | null>(null);

  useEffect(() => {
    fetchPastQuestions();
    fetchCourses();
  }, []);

  const fetchPastQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/past-questions');
      setPastQuestions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch past questions:', error);
      setPastQuestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const filteredCourses = useMemo(() => {
    const grouped: { [key: number]: { first: Course[], second: Course[] } } = {
      100: { first: [], second: [] },
      200: { first: [], second: [] },
      300: { first: [], second: [] },
      400: { first: [], second: [] },
    };

    courses.forEach((course) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          course.code.toLowerCase().includes(query) ||
          course.name.toLowerCase().includes(query);
        if (!matchesSearch) return;
      }

      if (course.semester === 'first') {
        grouped[course.level].first.push(course);
      } else {
        grouped[course.level].second.push(course);
      }
    });

    return grouped;
  }, [courses, searchQuery]);

  const getCoursePastQuestionCount = (courseCode: string) => {
    return pastQuestions.filter(pq => pq.courseCode === courseCode).length;
  };

  const handleCourseClick = async (course: Course) => {
    setSelectedCourse(course);
    setIsLoadingPastQuestions(true);
    try {
      const filtered = pastQuestions.filter(pq => pq.courseCode === course.code);
      setCoursePastQuestions(filtered);
    } catch (error) {
      console.error('Failed to filter past questions:', error);
    } finally {
      setIsLoadingPastQuestions(false);
    }
  };

  const toggleLevel = (level: number) => {
    setExpandedLevels(prev => ({...prev, [level]: !prev[level]}));
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Past Questions</h1>
          <p className="text-lg text-muted-foreground">Browse courses by level and semester</p>
        </div>

        <div className="mb-10">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
            <input
              type="text"
              placeholder="Search courses by code or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-border bg-background/80 backdrop-blur-sm text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-8 bg-muted rounded w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {[100, 200, 300, 400].map((level) => {
              const hasFirstSem = filteredCourses[level].first.length > 0;
              const hasSecondSem = filteredCourses[level].second.length > 0;
              
              if (!hasFirstSem && !hasSecondSem) return null;

              return (
                <div key={level}>
                  <button
                    onClick={() => toggleLevel(level)}
                    className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent hover:from-primary/20 hover:via-primary/10 rounded-2xl transition-all duration-300 mb-6 shadow-md hover:shadow-xl border border-primary/20"
                  >
                    <h2 className="text-3xl font-extrabold text-foreground">{level} Level</h2>
                    {expandedLevels[level] ? <ChevronUp className="w-7 h-7 text-primary" /> : <ChevronDown className="w-7 h-7 text-primary" />}
                  </button>

                  {expandedLevels[level] && (
                    <div className="space-y-8 pl-2 md:pl-6">
                      {hasFirstSem && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-1 w-12 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                            <h3 className="text-xl font-bold text-foreground">First Semester</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredCourses[level].first.map((course) => {
                              const pqCount = getCoursePastQuestionCount(course.code);
                              return (
                                <div 
                                  key={course.code} 
                                  onClick={() => handleCourseClick(course)} 
                                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                                >
                                  <div className="relative bg-gradient-to-br from-background to-background/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="p-5 relative z-10">
                                      <div className="flex items-start justify-between mb-3">
                                        <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-xs font-bold uppercase tracking-wide shadow-sm">
                                          {course.code}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {pqCount > 0 && (
                                            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-bold">
                                              {pqCount} PDF{pqCount !== 1 ? 's' : ''}
                                            </span>
                                          )}
                                          <BookOpen className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                        </div>
                                      </div>
                                      <h4 className="font-bold text-foreground line-clamp-2 text-base group-hover:text-primary transition-colors duration-300">
                                        {course.name}
                                      </h4>
                                    </div>
                                    <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {hasSecondSem && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-1 w-12 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
                            <h3 className="text-xl font-bold text-foreground">Second Semester</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredCourses[level].second.map((course) => {
                              const pqCount = getCoursePastQuestionCount(course.code);
                              return (
                                <div 
                                  key={course.code} 
                                  onClick={() => handleCourseClick(course)} 
                                  className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                                >
                                  <div className="relative bg-gradient-to-br from-background to-background/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="p-5 relative z-10">
                                      <div className="flex items-start justify-between mb-3">
                                        <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-xs font-bold uppercase tracking-wide shadow-sm">
                                          {course.code}
                                        </span>
                                        <div className="flex items-center gap-2">
                                          {pqCount > 0 && (
                                            <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-600 text-xs font-bold">
                                              {pqCount} PDF{pqCount !== 1 ? 's' : ''}
                                            </span>
                                          )}
                                          <BookOpen className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                                        </div>
                                      </div>
                                      <h4 className="font-bold text-foreground line-clamp-2 text-base group-hover:text-primary transition-colors duration-300">
                                        {course.name}
                                      </h4>
                                    </div>
                                    <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {selectedCourse && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300" onClick={() => setSelectedCourse(null)}>
            <div className="bg-background rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-border/50 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-border/50 flex items-start justify-between bg-gradient-to-r from-primary/5 to-transparent">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-sm font-bold uppercase tracking-wide shadow-sm">
                      {selectedCourse.code}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent/80 to-accent/60 text-foreground text-sm font-semibold shadow-sm">
                      {selectedCourse.level} Level - {selectedCourse.semester === 'first' ? 'First' : 'Second'} Semester
                    </span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-foreground">{selectedCourse.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2.5 hover:bg-red-500/10 rounded-xl transition-all duration-300 hover:scale-110 group"
                >
                  <X className="w-6 h-6 text-muted-foreground group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {isLoadingPastQuestions ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-24 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : coursePastQuestions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <FileText className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">No past questions available</h3>
                    <p className="text-muted-foreground text-lg">No past questions have been uploaded for this course yet.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {coursePastQuestions.map((pq) => (
                      <div key={pq.id} className="group bg-gradient-to-br from-background to-background/80 rounded-2xl shadow-md hover:shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{pq.title}</h3>
                              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{pq.description}</p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>Year: {pq.year}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  <span>{formatRelativeTime(pq.createdAt)}</span>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-xs font-semibold">PDF</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingPdf({url: pq.fileUrl, name: pq.fileName})}
                                className="shadow-sm hover:shadow-md transition-shadow"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.href = pq.fileUrl;
                                  link.download = pq.fileName;
                                  link.target = '_blank';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                                className="shadow-md hover:shadow-lg transition-shadow"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {viewingPdf && (
          <PdfViewer
            fileUrl={viewingPdf.url}
            fileName={viewingPdf.name}
            onClose={() => setViewingPdf(null)}
          />
        )}
      </div>
    </div>
  );
}
