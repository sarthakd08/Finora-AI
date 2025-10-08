'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, PhoneOff, Phone, Volume2, User, Loader2, AlertCircle, MessageSquare, Star, X, CheckCircle2, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSimpleVapi } from '@/lib/vapi/useSimpleVapi';
import { getConsultationById } from '@/lib/supabase/consultations';
import type { Consultation } from '@/types';

// Vapi type declaration
declare global {
  interface Window {
    vapi?: {
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      off: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

// Define a type for the consultation data fetched from DB
interface DBConsultation extends Omit<Consultation, 'userId' | 'userEmail' | 'agentName'> {
  user_id: string;
  user_email: string;
  agent_name: string;
  created_at: string;
  updated_at: string;
}

export default function ConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const consultationId = params.id as string;
  
  // Vapi integration
  const {
    isActive: isCallActive,
    isConnecting,
    isMuted,
    error,
    messages,
    streamingMessage,
    startCall,
    endCall,
    toggleMute,
  } = useSimpleVapi();

  // Consultation data
  const [consultation, setConsultation] = useState<DBConsultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [consultationError, setConsultationError] = useState<string | null>(null);
  
  // Feedback form state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: '',
    helpfulness: 0,
    clarity: 0
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [callDuration, setCallDuration] = useState('00:00');
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  
  const agentName = 'Alex Financial AI';
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, streamingMessage]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const timer = setTimeout(() => {
      if (transcriptEndRef.current) {
        transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, streamingMessage]);

  // Call timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCallActive && callStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - callStartTime.getTime();
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setCallDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive, callStartTime]);

  // Speaking detection based on messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      console.log('🎤 Last message speaker:', lastMessage.speaker);
      if (lastMessage.speaker === 'user') {
        console.log('🎤 User speaking detected');
        setIsUserSpeaking(true);
        setIsAgentSpeaking(false);
        // Reset user speaking after 2 seconds
    setTimeout(() => {
          console.log('🎤 User speaking reset');
          setIsUserSpeaking(false);
        }, 2000);
      } else if (lastMessage.speaker === 'assistant') {
        console.log('🎤 Agent speaking detected');
        setIsAgentSpeaking(true);
        setIsUserSpeaking(false);
        // Reset agent speaking after 2 seconds
    setTimeout(() => {
          console.log('🎤 Agent speaking reset');
          setIsAgentSpeaking(false);
        }, 2000);
      }
    }
  }, [messages]);

  // Speaking detection for streaming messages
  useEffect(() => {
    if (streamingMessage) {
      console.log('🎤 Streaming message speaker:', streamingMessage.speaker);
      if (streamingMessage.speaker === 'user') {
        console.log('🎤 User streaming detected');
        setIsUserSpeaking(true);
        setIsAgentSpeaking(false);
      } else if (streamingMessage.speaker === 'assistant') {
        console.log('🎤 Agent streaming detected');
        setIsAgentSpeaking(true);
        setIsUserSpeaking(false);
      }
    } else {
      // Reset speaking states when streaming stops
    setTimeout(() => {
        console.log('🎤 Streaming stopped, resetting speaking states');
        setIsUserSpeaking(false);
        setIsAgentSpeaking(false);
      }, 1000);
    }
  }, [streamingMessage]);

  // Real-time speaking detection from Vapi messages
  useEffect(() => {
    // Detect speaking based on messages and streaming
    if (streamingMessage) {
      const messageType = streamingMessage.speaker;
      
      if (messageType === 'assistant' || messageType === 'agent') {
        console.log('🤖 Agent is speaking (from streaming)');
        setIsAgentSpeaking(true);
        setIsUserSpeaking(false);
      } else if (messageType === 'user') {
        console.log('👤 User is speaking (from streaming)');
        setIsUserSpeaking(true);
        setIsAgentSpeaking(false);
      }
    }
    
    // When streaming stops, maintain speaking state briefly then clear
    if (!streamingMessage) {
      const timeout = setTimeout(() => {
        setIsAgentSpeaking(false);
        setIsUserSpeaking(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [streamingMessage]);
  
  // Detect speaking from completed messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      if (lastMessage.speaker === 'assistant' || lastMessage.speaker === 'agent') {
        console.log('🤖 Agent spoke (from message)');
        setIsAgentSpeaking(true);
        setIsUserSpeaking(false);
        setTimeout(() => setIsAgentSpeaking(false), 1500);
      } else if (lastMessage.speaker === 'user') {
        console.log('👤 User spoke (from message)');
        setIsUserSpeaking(true);
        setIsAgentSpeaking(false);
        setTimeout(() => setIsUserSpeaking(false), 1500);
      }
    }
  }, [messages]);

  // Fetch consultation data
  useEffect(() => {
    async function fetchConsultation() {
      try {
        setLoading(true);
        const result = await getConsultationById(consultationId);
        if (result.success && result.data) {
          setConsultation(result.data);
        } else {
          setConsultationError(typeof result.error === 'string' ? result.error : 'Consultation not found');
        }
      } catch (err) {
        console.error('Error fetching consultation:', err);
        setConsultationError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }

    if (consultationId) {
      fetchConsultation();
    }
  }, [consultationId]);

  const handleStartCall = async () => {
    try {
      console.log('🎯 User clicked start call button');
      await startCall('acc55e7b-fc1d-4733-9d1c-5ac1b606ab81');
      setCallStartTime(new Date());
      setCallDuration('00:00');
    } catch (err) {
      console.error('❌ Error starting call:', err);
      // The error will be handled by the Vapi client and shown in the UI
    }
  };

  const handleEndCall = async () => {
    try {
      await endCall();
    console.log('📞 Ending consultation:', consultationId);
      // Show feedback form instead of redirecting immediately
      setShowFeedbackForm(true);
    } catch (err) {
      console.error('Error ending call:', err);
    }
  };

  const handleToggleMute = async () => {
    try {
      await toggleMute();
    } catch (err) {
      console.error('Error toggling mute:', err);
    }
  };

  const clearError = () => {
    // Simple error clearing - in a real app, you'd want to implement this
    window.location.reload();
  };

  const saveCallInfo = async (includeFeedback = false) => {
    try {
      // Calculate call duration (assuming call started when consultation was created)
      const callStartTime = new Date(consultation?.created_at || new Date());
      const callEndTime = new Date();
      const durationMs = callEndTime.getTime() - callStartTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);
      const durationSeconds = Math.floor((durationMs % 60000) / 1000);
      const duration = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

      const updateData: {
        status: string;
        duration: string;
        feedback?: {
          rating: number;
          comment: string;
          helpfulness: number;
          clarity: number;
          timestamp: string;
        };
      } = {
        status: 'completed',
        duration: duration,
      };

      // Include feedback if provided
      if (includeFeedback && feedbackData.rating > 0) {
        updateData.feedback = {
          rating: feedbackData.rating,
          comment: feedbackData.comment,
          helpfulness: feedbackData.helpfulness,
          clarity: feedbackData.clarity,
          timestamp: new Date().toISOString()
        };
      }

      // Update consultation with call info
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to save call info');
      }

      console.log('✅ Call info saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Error saving call info:', error);
      return false;
    }
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackData.rating === 0) {
      alert('Please provide a rating before submitting feedback.');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const success = await saveCallInfo(true);
      
      if (!success) {
        throw new Error('Failed to save feedback');
      }

      console.log('✅ Feedback saved successfully');
      
      // Show thanks message for 1 second
      setShowThanksMessage(true);
      setTimeout(() => {
    router.push('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error saving feedback:', error);
      alert('Failed to save feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleFeedbackClose = async () => {
    try {
      // Save call info without feedback
      const success = await saveCallInfo(false);
      
      if (success) {
        console.log('✅ Call info saved (no feedback)');
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        console.error('❌ Failed to save call info');
        // Still redirect to dashboard even if save fails
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('❌ Error saving call info:', error);
      // Still redirect to dashboard even if save fails
      router.push('/dashboard');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="ml-4 text-lg text-slate-700 dark:text-slate-300">Loading consultation...</p>
      </div>
    );
  }

  if (consultationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center justify-center gap-2">
              <AlertCircle className="w-6 h-6" /> Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-red-600 dark:text-red-300">{consultationError}</p>
            <Button onClick={() => router.push('/dashboard')}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleEndCall} // End call and go to dashboard
              className="flex items-center gap-2"
            >
              ← Back
            </Button>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-slate-900 dark:text-white">Active Consultation</h1>
              <p className="text-xs lg:text-sm text-slate-600 dark:text-slate-400">{consultation?.title}</p>
            </div>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Active Call Screen */}
        <main className="w-full overflow-hidden">
        <div className="flex h-[calc(100vh-80px)] p-4 lg:p-6 gap-4 lg:gap-6">
          {/* LEFT SIDE - Call Interface */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-hidden">
              <Card className="border-none shadow-2xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm flex-1 overflow-auto">
                  <CardContent className="p-5 lg:p-7 space-y-5">
                  <div className="text-center mb-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{agentName}</h2>
                    
                    {/* Avatars - Horizontally Aligned with Glass Design */}
                    <div className="bg-white/40 dark:bg-gray-700/30 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-600/30 shadow-xl">
                      <div className="flex items-center justify-center gap-12">
                      {/* Agent Avatar */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center shadow-lg transition-all duration-300 ${
                            isAgentSpeaking ? 'scale-110 shadow-2xl' : ''
                          }`}>
                            <User className="w-14 h-14 text-white" />
                          </div>
                          {/* Ripple effect for agent speaking */}
                          {isAgentSpeaking && (
                            <>
                              <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-75"></div>
                            </>
                          )}
                          {/* Active indicator for agent */}
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>
                        <div className="text-center mt-1">
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">AI Agent</p>
                          </div>
                      </div>

                      {/* User Avatar */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                          <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg transition-all duration-300 ${
                            isUserSpeaking ? 'scale-110 shadow-2xl' : ''
                          }`}>
                            <User className="w-14 h-14 text-white" />
                          </div>
                          {/* Ripple effect for user speaking */}
                          {isUserSpeaking && (
                            <>
                              <div className="absolute inset-0 rounded-full border-4 border-blue-400 animate-ping"></div>
                              <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-75"></div>
                            </>
                          )}
                          {/* Active indicator for user */}
                          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-4 border-white dark:border-gray-800 flex items-center justify-center shadow-lg">
                            <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>
                        <div className="text-center mt-1">
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">You</p>
                        </div>
                      </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <Badge variant="secondary" className={`${
                        isConnecting
                          ? 'bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-300'
                          : isCallActive
                          ? 'bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}>
                        {isConnecting ? 'Connecting...' : isCallActive ? 'Connected' : 'Ready'}
                        </Badge>
                      {/* Call Timer */}
                      {isCallActive && (
                        <div className="flex items-center gap-3 text-lg font-mono text-slate-600 dark:text-slate-400">
                          <Clock className="w-6 h-6" />
                          <span className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-xl font-bold">
                            {callDuration}
                          </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Call Controls */}
                  {!isCallActive && !isConnecting ? (
                    // Start Call Button with Enhanced UI
                    <div className="flex flex-col items-center gap-4 mt-4">
                      <div className="relative">
                        {/* Animated glow rings */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 blur-2xl opacity-50 animate-pulse"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-40"></div>
                        
                        {/* Main button */}
                        <Button
                          size="lg"
                          className="relative h-20 w-20 rounded-full bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white shadow-2xl hover:shadow-emerald-500/60 transition-all duration-300 transform hover:scale-110 group"
                          onClick={handleStartCall}
                        >
                          {/* Shine effect */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Icon with pulse animation */}
                          <div className="relative flex flex-col items-center gap-0.5">
                            <Phone className="w-6 h-6 animate-bounce" />
                            <span className="text-[10px] font-bold tracking-wide">START</span>
                          </div>
                        </Button>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Click to start consultation
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Active Call Controls
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <Button
                        size="lg"
                        className="h-12 w-12"
                        variant={isMuted ? 'destructive' : 'secondary'}
                        onClick={handleToggleMute}
                        disabled={!isCallActive}
                      >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                      </Button>
                      <Button
                        size="lg"
                        className="h-12 w-12 bg-red-600 hover:bg-red-700"
                        onClick={handleEndCall}
                      >
                        <PhoneOff className="w-6 h-6" />
                      </Button>
                      <Button size="lg" className="h-12 w-12" variant="secondary">
                        <Volume2 className="w-6 h-6" />
                      </Button>
                    </div>
                  )}

                  {/* Status Message */}
                    <div className="text-center mt-6">
                    {error && (
                      <div className="mb-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-red-600 dark:text-red-400 font-medium mb-2">Connection Error</p>
                        <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={clearError}
                          className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                      {isConnecting 
                        ? 'Connecting to your financial advisor...' 
                        : isCallActive 
                        ? 'You are now connected with Alex. Start speaking to begin your consultation.'
                        : !isCallActive && !isConnecting
                        ? 'Ready to start your consultation with Alex. Click the green button above to begin.'
                        : 'Call ended. You can start a new consultation from the dashboard.'
                      }
                    </p>
                    </div>
                  </CardContent>
                </Card>

              {/* Consultation Details - Always visible on left */}
              {consultation && (
                <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base dark:text-white">Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 pt-0">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">TOPIC</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{consultation.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">CATEGORY</p>
                      <Badge variant="secondary" className="capitalize text-xs">{consultation.category}</Badge>
                    </div>
                    {consultation.goals && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">GOALS</p>
                        <p className="text-xs text-slate-700 dark:text-slate-300">{consultation.goals}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

          {/* RIGHT SIDE - Transcript Only */}
          <div className="w-full lg:w-1/2 flex flex-col overflow-hidden">
              {/* Live Transcript - Always visible with Glass Design */}
              <Card className="border-none shadow-2xl bg-gradient-to-br from-white/95 via-white/90 to-white/85 dark:from-gray-800/95 dark:via-gray-800/90 dark:to-gray-800/85 backdrop-blur-md flex-1 overflow-hidden flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-600/50 backdrop-blur-sm border-b border-blue-100 dark:border-gray-600/30 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                        <MessageSquare className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg dark:text-white font-bold">
                    Live Transcript
                  </CardTitle>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          Real-time conversation
                        </p>
                      </div>
                    </div>
                    {isCallActive && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white mr-2 inline-block animate-ping"></span>
                        LIVE
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <div className="h-full overflow-y-auto space-y-3 p-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {messages.length === 0 && !streamingMessage ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 shadow-lg">
                          <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 font-semibold mb-2">No messages yet</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">Start the call to begin live transcription</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar for agent messages */}
                              {message.speaker === 'assistant' && (
                                <div className="relative flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center transition-all duration-300 ${
                                    isAgentSpeaking ? 'scale-110 shadow-lg' : ''
                                  }`}>
                                    <User className="w-4 h-4 text-white" />
                                  </div>
                                  {/* Ripple effect for agent speaking */}
                                  {isAgentSpeaking && (
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
                                  )}
                        </div>
                              )}
                              
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg ${
                                  message.speaker === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                <p className="text-xs font-semibold mb-2 opacity-80">
                                  {message.speaker === 'user' ? 'You' : agentName}
                                </p>
                                <p className="text-sm leading-relaxed">{message.text}</p>
                                <p className="text-xs opacity-60 mt-2 text-right">
                                  {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                              
                              {/* Avatar for user messages */}
                              {message.speaker === 'user' && (
                                <div className="relative flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transition-all duration-300 ${
                                    isUserSpeaking ? 'scale-110 shadow-lg' : ''
                                  }`}>
                                    <User className="w-4 h-4 text-white" />
                                  </div>
                                  {/* Ripple effect for user speaking */}
                                  {isUserSpeaking && (
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
                                  )}
                                </div>
                              )}
                      </div>
                    </div>
                  ))}
                        
                        {/* Streaming message with typing indicator */}
                        {streamingMessage && (
                          <div className={`flex ${streamingMessage.speaker === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                            <div className="flex items-start gap-3">
                              {/* Avatar for agent streaming */}
                              {streamingMessage.speaker === 'assistant' && (
                                <div className="relative flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center transition-all duration-300 ${
                                    isAgentSpeaking ? 'scale-110 shadow-lg' : ''
                                  }`}>
                                    <User className="w-4 h-4 text-white" />
                                  </div>
                                  {/* Ripple effect for agent speaking */}
                                  {isAgentSpeaking && (
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
                                  )}
                                </div>
                              )}
                              
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md ${
                                  streamingMessage.speaker === 'user'
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-blue-400 dark:border-blue-500'
                                }`}
                              >
                                <p className="text-xs font-semibold mb-2 opacity-80">
                                  {streamingMessage.speaker === 'user' ? 'You' : agentName}
                                </p>
                                <p className="text-sm leading-relaxed">
                                  {streamingMessage.text}
                                  <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
                                </p>
                                <p className="text-xs opacity-60 mt-2 flex items-center gap-1">
                                  <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                                  {streamingMessage.speaker === 'user' ? 'Speaking...' : 'Typing...'}
                                </p>
                              </div>
                              
                              {/* Avatar for user streaming */}
                              {streamingMessage.speaker === 'user' && (
                                <div className="relative flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transition-all duration-300 ${
                                    isUserSpeaking ? 'scale-110 shadow-lg' : ''
                                  }`}>
                                    <User className="w-4 h-4 text-white" />
                                  </div>
                                  {/* Ripple effect for user speaking */}
                                  {isUserSpeaking && (
                                    <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping"></div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div ref={transcriptEndRef} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

      {/* Thanks Message Overlay */}
      {showThanksMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <Card className="relative w-full max-w-sm mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="py-8 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Thank You!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your feedback has been saved successfully.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Feedback Form Popup with Glass Effect */}
      {showFeedbackForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Feedback Form */}
          <Card className="relative w-full max-w-md mx-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  How was your consultation?
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFeedbackClose}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Your feedback helps us improve our service
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Overall Rating */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Overall Rating *
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= feedbackData.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-slate-300 hover:text-yellow-400'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                    {feedbackData.rating > 0 ? `${feedbackData.rating}/5` : 'Select rating'}
                  </span>
                </div>
              </div>

              {/* Helpfulness Rating */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  How helpful was the advice?
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({ ...feedbackData, helpfulness: star })}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackData.helpfulness
                            ? 'text-blue-500 fill-blue-500'
                            : 'text-slate-300 hover:text-blue-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Clarity Rating */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  How clear were the explanations?
                </Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({ ...feedbackData, clarity: star })}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= feedbackData.clarity
                            ? 'text-purple-500 fill-purple-500'
                            : 'text-slate-300 hover:text-purple-400'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Additional Comments (Optional)
                </Label>
                <Textarea
                  id="comment"
                  placeholder="Tell us about your experience..."
                  value={feedbackData.comment}
                  onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleFeedbackSubmit}
                disabled={isSubmittingFeedback || feedbackData.rating === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmittingFeedback ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Feedback'
                )}
              </Button>
            </CardContent>
          </Card>
      </div>
      )}
    </div>
  );
}