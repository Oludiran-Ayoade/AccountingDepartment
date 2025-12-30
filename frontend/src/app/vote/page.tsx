'use client';

import React, { useState, useEffect } from 'react';
import { Vote as VoteIcon, CheckCircle, Award, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

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

export default function VotePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  const [closedElections, setClosedElections] = useState<Election[]>([]);
  const [voteResultsMap, setVoteResultsMap] = useState<{ [electionId: string]: any[] }>({});
  const [selectedVotes, setSelectedVotes] = useState<{ [positionId: string]: string }>({});
  const [votedPositions, setVotedPositions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    fetchElections();
    fetchMyVotes();
  }, [isAuthenticated, router]);

  const fetchElections = async () => {
    try {
      const response = await api.get('/elections');
      const allElections = response.data || [];
      
      // Filter open elections based on user level
      const availableElections = allElections.filter((election: Election) => {
        if (!election.isOpen) return false;
        if (election.electionType === 'general') return true;
        if (election.electionType === 'level-based' && user?.level === election.targetLevel) return true;
        return false;
      });
      
      // Filter closed elections (recent ones)
      const recentClosedElections = allElections.filter((election: Election) => {
        if (election.isOpen) return false;
        if (election.electionType === 'general') return true;
        if (election.electionType === 'level-based' && user?.level === election.targetLevel) return true;
        return false;
      }).slice(0, 3); // Show only 3 most recent
      
      setElections(availableElections);
      setClosedElections(recentClosedElections);
      
      // Fetch results for closed elections
      for (const election of recentClosedElections) {
        fetchVoteResults(election.id);
      }
    } catch (err) {
      setElections([]);
      setClosedElections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVoteResults = async (electionId: string) => {
    try {
      const response = await api.get(`/elections/${electionId}/results`);
      setVoteResultsMap(prev => ({ ...prev, [electionId]: response.data || [] }));
    } catch (err) {
      
    }
  };

  const getVoteCount = (electionId: string, candidateId: string): number => {
    const results = voteResultsMap[electionId] || [];
    const result = results.find((r: any) => r._id.candidateId === candidateId);
    return result ? result.count : 0;
  };

  const getTotalVotesForPosition = (electionId: string, positionId: string): number => {
    const results = voteResultsMap[electionId] || [];
    return results
      .filter((r: any) => r._id.positionId === positionId)
      .reduce((sum: number, r: any) => sum + r.count, 0);
  };

  const fetchMyVotes = async () => {
    try {
      const response = await api.get('/elections/my-votes');
      const votes = response.data || [];
      const votedPos = new Set<string>(votes.map((v: any) => String(v.positionId)));
      setVotedPositions(votedPos);
    } catch (err) {
      
    }
  };

  const handleVote = async (electionId: string, positionId: string, candidateId: string) => {
    setError('');
    setSuccess('');

    try {
      await api.post('/elections/vote', {
        electionId,
        positionId,
        candidateId,
      });
      
      setSuccess('Vote cast successfully!');
      setVotedPositions(new Set([...votedPositions, positionId]));
      
      // Clear selection
      const newSelectedVotes = { ...selectedVotes };
      delete newSelectedVotes[positionId];
      setSelectedVotes(newSelectedVotes);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cast vote');
    }
  };

  const selectCandidate = (positionId: string, candidateId: string) => {
    setSelectedVotes({ ...selectedVotes, [positionId]: candidateId });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <VoteIcon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Vote</h1>
          </div>
          <p className="text-muted-foreground">Cast your vote in open elections</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
          </div>
        )}

        {/* Recent Winners Section */}
        {closedElections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
              <Award className="w-6 h-6 mr-2 text-yellow-600" />
              Recent Election Winners
            </h2>
            <div className="space-y-4">
              {closedElections.map((election) => (
                <Card key={election.id} className="border-yellow-600/20">
                  <CardHeader>
                    <h3 className="text-xl font-bold text-foreground">{election.title}</h3>
                    <p className="text-sm text-muted-foreground">{election.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {election.positions.map((position) => {
                        const totalVotes = getTotalVotesForPosition(election.id, position.id);
                        const maxVotes = Math.max(...position.candidates.map(c => getVoteCount(election.id, c.id)), 1);
                        
                        // Sort candidates by vote count (highest first)
                        const sortedCandidates = [...position.candidates].sort((a, b) => 
                          getVoteCount(election.id, b.id) - getVoteCount(election.id, a.id)
                        );

                        return (
                          <div key={position.id} className="border border-border rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className="text-lg font-bold text-foreground">{position.title}</h4>
                              <span className="text-sm text-muted-foreground">{totalVotes} total votes</span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {sortedCandidates.map((candidate, index) => {
                                const votes = getVoteCount(election.id, candidate.id);
                                const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                                const barWidth = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
                                const isWinner = candidate.isWinner;

                                return (
                                  <div
                                    key={candidate.id}
                                    className={`p-4 rounded-xl border-2 transition-all ${
                                      isWinner
                                        ? 'border-green-600 bg-gradient-to-br from-yellow-500/10 to-green-500/10'
                                        : 'border-border bg-accent/50'
                                    }`}
                                  >
                                    {/* Ranking Badge */}
                                    <div className="flex justify-between items-start mb-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                        isWinner ? 'bg-green-600' : 'bg-primary'
                                      }`}>
                                        {index + 1}
                                      </div>
                                      {isWinner && (
                                        <Award className="w-5 h-5 text-yellow-600" />
                                      )}
                                    </div>

                                    {/* Profile Picture */}
                                    <div className="flex flex-col items-center text-center mb-3">
                                      <div className="relative mb-2">
                                        {candidate.imageUrl ? (
                                          <img
                                            src={candidate.imageUrl}
                                            alt={candidate.name}
                                            className="w-20 h-20 rounded-full object-cover border-4 border-primary"
                                          />
                                        ) : (
                                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-xl border-4 border-primary">
                                            {candidate.name.split(' ').map(n => n[0]).join('')}
                                          </div>
                                        )}
                                      </div>
                                      <h5 className="font-bold text-foreground text-base mb-1">
                                        {candidate.name}
                                      </h5>
                                      <p className="text-xs text-muted-foreground">{candidate.matricNumber}</p>
                                      <p className="text-xs text-muted-foreground">{candidate.level} Level</p>
                                    </div>

                                    {/* Vote Stats */}
                                    <div className="text-center mb-3">
                                      <p className={`text-2xl font-bold ${isWinner ? 'text-green-600' : 'text-foreground'}`}>
                                        {votes}
                                      </p>
                                      <p className="text-xs text-muted-foreground">votes ({percentage.toFixed(1)}%)</p>
                                    </div>

                                    {/* Bar Chart */}
                                    <div className="w-full h-2 bg-accent rounded-full overflow-hidden mb-2">
                                      <div
                                        className={`h-full transition-all duration-500 ${
                                          isWinner
                                            ? 'bg-gradient-to-r from-green-600 to-green-500'
                                            : 'bg-gradient-to-r from-primary to-primary/80'
                                        }`}
                                        style={{ width: `${barWidth}%` }}
                                      />
                                    </div>

                                    {/* Winner Badge */}
                                    {isWinner && (
                                      <div className="text-center">
                                        <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
                                          WINNER
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Open Elections Section */}
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
          <VoteIcon className="w-6 h-6 mr-2 text-primary" />
          Open Elections
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading elections...</p>
          </div>
        ) : elections.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <VoteIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Open Elections</h3>
              <p className="text-muted-foreground">
                There are currently no elections available for you to vote in.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {elections.map((election) => (
              <Card key={election.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">{election.title}</h2>
                      <p className="text-muted-foreground">{election.description}</p>
                      <div className="flex items-center space-x-2 mt-3">
                        <span className="px-2 py-1 text-xs font-medium rounded bg-green-500/10 text-green-600">
                          Open
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded bg-blue-500/10 text-blue-600">
                          {election.electionType === 'general' ? 'General Election' : `${election.targetLevel} Level`}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {election.positions.map((position) => {
                      const hasVoted = votedPositions.has(position.id);
                      const selectedCandidateId = selectedVotes[position.id];

                      return (
                        <div key={position.id} className="border border-border rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-foreground">{position.title}</h3>
                              {position.description && (
                                <p className="text-sm text-muted-foreground">{position.description}</p>
                              )}
                            </div>
                            {hasVoted && (
                              <span className="px-3 py-1 bg-green-500/10 text-green-600 text-sm font-medium rounded-full flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Voted
                              </span>
                            )}
                          </div>

                          {hasVoted ? (
                            <div className="text-center py-8 bg-accent rounded-lg">
                              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                              <p className="text-foreground font-medium">You have already voted for this position</p>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                {position.candidates.map((candidate) => (
                                  <button
                                    key={candidate.id}
                                    onClick={() => selectCandidate(position.id, candidate.id)}
                                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                                      selectedCandidateId === candidate.id
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border hover:border-primary/50'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-3">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                                        {candidate.name.split(' ').map(n => n[0]).join('')}
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="font-bold text-foreground">{candidate.name}</h4>
                                        <p className="text-sm text-muted-foreground">{candidate.matricNumber}</p>
                                        <p className="text-xs text-muted-foreground">{candidate.level} Level</p>
                                      </div>
                                      {selectedCandidateId === candidate.id && (
                                        <CheckCircle className="w-6 h-6 text-primary" />
                                      )}
                                    </div>
                                    {candidate.manifesto && (
                                      <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                        {candidate.manifesto}
                                      </p>
                                    )}
                                  </button>
                                ))}
                              </div>

                              {selectedCandidateId && (
                                <div className="flex justify-end">
                                  <Button
                                    variant="primary"
                                    onClick={() => handleVote(election.id, position.id, selectedCandidateId)}
                                  >
                                    <VoteIcon className="w-4 h-4 mr-2" />
                                    Cast Vote
                                  </Button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
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
