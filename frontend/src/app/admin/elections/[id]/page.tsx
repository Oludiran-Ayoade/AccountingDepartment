'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Award, Users, TrendingUp, Trophy, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showSuccess, showError, showWarning, showInfo } from '@/lib/toast';
import { toast } from 'react-toastify';

interface Candidate {
  id: string;
  userId: string;
  name: string;
  level: number;
  matricNumber: string;
  manifesto: string;
  imageUrl: string;
  isWinner: boolean;
  voteCount: number;
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
  status: string;
  isOpen: boolean;
  electionType: string;
  targetLevel: number;
  startDate: string;
  endDate: string;
  positions: Position[];
}

interface VoteResult {
  _id: {
    positionId: string;
    candidateId: string;
  };
  count: number;
}

export default function ElectionDetailsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const electionId = params.id as string;
  
  const [election, setElection] = useState<Election | null>(null);
  const [voteResults, setVoteResults] = useState<VoteResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchElectionDetails();
    fetchVoteResults();
  }, [isAuthenticated, user, router, electionId]);

  const fetchElectionDetails = async () => {
    try {
      const response = await api.get(`/elections/${electionId}`);
      setElection(response.data);
    } catch (err) {
      console.error('Failed to fetch election:', err);
      setError('Failed to load election details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoteResults = async () => {
    try {
      const response = await api.get(`/elections/${electionId}/results`);
      setVoteResults(response.data || []);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
  };

  const getVoteCount = (candidateId: string): number => {
    const result = voteResults.find(r => r._id.candidateId === candidateId);
    return result ? result.count : 0;
  };

  const getTotalVotesForPosition = (positionId: string): number => {
    return voteResults
      .filter(r => r._id.positionId === positionId)
      .reduce((sum, r) => sum + r.count, 0);
  };

  const getLeadingCandidate = (position: Position): Candidate | null => {
    if (position.candidates.length === 0) return null;
    
    const candidatesWithVotes = position.candidates.map(c => ({
      ...c,
      votes: getVoteCount(c.id),
    }));
    
    return candidatesWithVotes.reduce((prev, current) => 
      current.votes > prev.votes ? current : prev
    );
  };

  const declareWinner = async (positionId: string, candidateId: string) => {
    try {
      await api.put(`/elections/${electionId}/declare-winner`, {
        positionId,
        candidateId,
      });
      showSuccess('🏆 Winner declared successfully!');
      fetchElectionDetails();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to declare winner');
    }
  };

  const closeAndFinalizeElection = async () => {
    const confirmToast = toast.info(
      <div>
        <p className="font-semibold mb-2">Close & Finalize Election?</p>
        <p className="text-sm mb-3">This will close the election and declare the leading candidates as winners.</p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(confirmToast);
              try {
                showInfo('Processing...');
                // First, close the election
                await api.put(`/elections/${electionId}/toggle`, { isOpen: false });

                // Then declare winners for each position (candidate with most votes)
                if (election) {
                  for (const position of election.positions) {
                    const leadingCandidate = getLeadingCandidate(position);
                    if (leadingCandidate && getVoteCount(leadingCandidate.id) > 0) {
                      await declareWinner(position.id, leadingCandidate.id);
                    }
                  }
                }

                showSuccess('🎉 Election closed and winners declared successfully!');
                fetchElectionDetails();
              } catch (err: any) {
                showError(err.response?.data?.error || 'Failed to finalize election');
              }
            }}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Confirm
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

  const deleteElection = async () => {
    const confirmToast = toast.warning(
      <div>
        <p className="font-semibold mb-2">Delete Election?</p>
        <p className="text-sm mb-3">This action cannot be undone!</p>
        <div className="flex space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(confirmToast);
              try {
                await api.delete(`/elections/${electionId}`);
                showSuccess('Election deleted successfully!');
                setTimeout(() => router.push('/admin/elections'), 1500);
              } catch (err: any) {
                showError(err.response?.data?.error || 'Failed to delete election');
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

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-muted-foreground">Loading election details...</p>
        </div>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-red-600">Election not found</p>
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
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{election.title}</h1>
              <p className="text-muted-foreground">{election.description}</p>
              <div className="flex items-center space-x-2 mt-3">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  election.isOpen ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'
                }`}>
                  {election.isOpen ? 'Open' : 'Closed'}
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded bg-blue-500/10 text-blue-600">
                  {election.electionType === 'general' ? 'General' : `${election.targetLevel} Level`}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
              {election.isOpen && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={closeAndFinalizeElection}
                  className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Close & Finalize Election
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={deleteElection}
                className="text-red-600 hover:bg-red-800 w-full sm:w-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Election
              </Button>
            </div>
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

        {/* Positions and Results */}
        <div className="space-y-8">
          {election.positions.map((position) => {
            const totalVotes = getTotalVotesForPosition(position.id);
            const leadingCandidate = getLeadingCandidate(position);
            const maxVotes = Math.max(...position.candidates.map(c => getVoteCount(c.id)), 1);

            return (
              <Card key={position.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{position.title}</h2>
                      {position.description && (
                        <p className="text-sm text-muted-foreground">{position.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Votes</p>
                      <p className="text-3xl font-bold text-foreground">{totalVotes}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {leadingCandidate && totalVotes > 0 && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-6 h-6 text-yellow-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Currently Leading</p>
                          <p className="text-lg font-bold text-foreground">
                            {leadingCandidate.name} - {getVoteCount(leadingCandidate.id)} votes
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {position.candidates.map((candidate) => {
                      const votes = getVoteCount(candidate.id);
                      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                      const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;

                      return (
                        <div
                          key={candidate.id}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            candidate.isWinner
                              ? 'border-green-600 bg-green-600/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {/* Profile Picture and Name */}
                          <div className="flex flex-col items-center text-center mb-4">
                            <div className="relative mb-3">
                              {candidate.imageUrl ? (
                                <img
                                  src={candidate.imageUrl}
                                  alt={candidate.name}
                                  className="w-20 h-20 rounded-full object-cover border-4 border-primary"
                                />
                              ) : (
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-2xl border-4 border-primary">
                                  {candidate.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              )}
                              {candidate.isWinner && (
                                <div className="absolute -top-2 -right-2 bg-green-600 rounded-full p-1">
                                  <Trophy className="w-5 h-5 text-white" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-bold text-foreground text-lg mb-1">
                              {candidate.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">{candidate.matricNumber}</p>
                            <p className="text-xs text-muted-foreground">{candidate.level} Level</p>
                          </div>

                          {/* Vote Stats */}
                          <div className="text-center mb-3">
                            <p className="text-3xl font-bold text-foreground">{votes}</p>
                            <p className="text-sm text-muted-foreground">votes ({percentage.toFixed(1)}%)</p>
                          </div>

                          {/* Bar Chart */}
                          <div className="mb-3">
                            <div className="w-full h-6 bg-accent rounded-lg overflow-hidden">
                              <div
                                className={`h-full transition-all duration-500 flex items-center justify-center ${
                                  candidate.isWinner
                                    ? 'bg-gradient-to-r from-green-600 to-green-500'
                                    : 'bg-gradient-to-r from-primary to-primary/80'
                                }`}
                                style={{ width: `${barWidth}%` }}
                              >
                                {votes > 0 && barWidth > 20 && (
                                  <span className="text-white font-bold text-xs">{votes}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          {!candidate.isWinner && !election.isOpen && votes > 0 && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => declareWinner(position.id, candidate.id)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <Award className="w-4 h-4 mr-2" />
                              Declare Winner
                            </Button>
                          )}

                          {candidate.isWinner && (
                            <div className="flex items-center justify-center space-x-2 p-2 bg-green-600/20 rounded-lg">
                              <Trophy className="w-5 h-5 text-green-600" />
                              <span className="font-bold text-green-600">WINNER</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {totalVotes === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No votes cast yet for this position</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
