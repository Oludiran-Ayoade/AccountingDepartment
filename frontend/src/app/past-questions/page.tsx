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
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-1 xs:p-2 sm:p-4 animate-in fade-in duration-300" onClick={() => setSelectedCourse(null)}>
            <div className="bg-background rounded-xl sm:rounded-2xl lg:rounded-3xl max-w-4xl w-full max-h-[96vh] sm:max-h-[92vh] lg:max-h-[90vh] overflow-hidden shadow-2xl border border-border/50 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
              <div className="p-2 xs:p-3 sm:p-5 lg:p-6 border-b border-border/50 flex items-start justify-between gap-2 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2 sm:mb-3">
                    <span className="px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gradient-to-r from-primary/20 to-primary/10 text-primary text-[10px] xs:text-xs sm:text-sm font-bold uppercase tracking-wide shadow-sm whitespace-nowrap">
                      {selectedCourse.code}
                    </span>
                    <span className="px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-gradient-to-r from-accent/80 to-accent/60 text-foreground text-[10px] xs:text-xs sm:text-sm font-semibold shadow-sm whitespace-nowrap">
                      {selectedCourse.level}L - {selectedCourse.semester === 'first' ? '1st' : '2nd'} Sem
                    </span>
                  </div>
                  <h2 className="text-sm xs:text-base sm:text-xl lg:text-2xl xl:text-3xl font-extrabold text-foreground line-clamp-2 leading-tight">{selectedCourse.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-1 xs:p-1.5 sm:p-2.5 hover:bg-red-500/10 rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-110 group flex-shrink-0"
                >
                  <X className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-red-500 transition-colors" />
                </button>
              </div>

              <div className="p-2 xs:p-3 sm:p-5 lg:p-6 overflow-y-auto max-h-[calc(96vh-80px)] xs:max-h-[calc(96vh-90px)] sm:max-h-[calc(92vh-110px)] lg:max-h-[calc(90vh-120px)]">
                {isLoadingPastQuestions ? (
                  <div className="space-y-3 sm:space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 sm:h-24 bg-muted rounded" />
                      </div>
                    ))}
                  </div>
                ) : coursePastQuestions.length === 0 ? (
                  <div className="text-center py-6 xs:py-8 sm:py-12 lg:py-16">
                    <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 xs:mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <FileText className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-primary" />
                    </div>
                    <h3 className="text-base xs:text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-1.5 xs:mb-2 px-4">No past questions available</h3>
                    <p className="text-muted-foreground text-xs xs:text-sm sm:text-base lg:text-lg px-4">No past questions have been uploaded for this course yet.</p>
                  </div>
                ) : (
                  <div className="space-y-2 xs:space-y-3 sm:space-y-4 lg:space-y-5">
                    {coursePastQuestions.map((pq) => (
                      <div key={pq.id} className="group bg-gradient-to-br from-background to-background/80 rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md hover:shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden">
                        <div className="p-2 xs:p-3 sm:p-4 lg:p-5">
                          <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4">
                            <div className="flex-1 w-full">
                              <h3 className="text-sm xs:text-base sm:text-lg lg:text-xl font-bold text-foreground mb-1 xs:mb-1.5 sm:mb-2 group-hover:text-primary transition-colors leading-tight">{pq.title}</h3>
                              <p className="text-[11px] xs:text-xs sm:text-sm text-muted-foreground mb-2 xs:mb-3 sm:mb-4 leading-relaxed line-clamp-2">{pq.description}</p>
                              <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3 lg:gap-4 text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                                <div className="flex items-center gap-0.5 xs:gap-1">
                                  <Calendar className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="whitespace-nowrap">Year: {pq.year}</span>
                                </div>
                                <div className="flex items-center gap-0.5 xs:gap-1">
                                  <Calendar className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                  <span className="truncate">{formatRelativeTime(pq.createdAt)}</span>
                                </div>
                                <span className="px-1.5 xs:px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 text-primary text-[10px] xs:text-xs font-semibold whitespace-nowrap">PDF</span>
                              </div>
                            </div>
                            <div className="flex gap-1.5 xs:gap-2 sm:gap-3 w-full">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewingPdf({url: pq.fileUrl, name: pq.fileName})}
                                className="shadow-sm hover:shadow-md transition-shadow flex-1 text-[11px] xs:text-xs sm:text-sm h-8 xs:h-9 sm:h-10 px-2 xs:px-3 sm:px-4"
                              >
                                <Eye className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 mr-1 xs:mr-1.5 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">Preview</span>
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
                                className="shadow-md hover:shadow-lg transition-shadow flex-1 text-[11px] xs:text-xs sm:text-sm h-8 xs:h-9 sm:h-10 px-2 xs:px-3 sm:px-4"
                              >
                                <Download className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 mr-1 xs:mr-1.5 sm:mr-2 flex-shrink-0" />
                                <span className="truncate">Download</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="h-0.5 sm:h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
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
