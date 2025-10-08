'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, PhoneOff, Volume2, User, Loader2, AlertCircle, MessageSquare, Star, X, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useSimpleVapi } from '@/lib/vapi/useSimpleVapi';
import { getConsultationById } from '@/lib/supabase/consultations';
import type { Consultation } from '@/types';

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
    clearMessages,
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

  const handleFeedbackSubmit = async () => {
    if (feedbackData.rating === 0) {
      alert('Please provide a rating before submitting feedback.');
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      // Calculate call duration (assuming call started when consultation was created)
      const callStartTime = new Date(consultation?.created_at || new Date());
      const callEndTime = new Date();
      const durationMs = callEndTime.getTime() - callStartTime.getTime();
      const durationMinutes = Math.floor(durationMs / 60000);
      const durationSeconds = Math.floor((durationMs % 60000) / 1000);
      const duration = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

      // Update consultation with feedback, status, and duration
      const response = await fetch(`/api/consultations/${consultationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'completed',
          duration: duration,
          feedback: {
            rating: feedbackData.rating,
            comment: feedbackData.comment,
            helpfulness: feedbackData.helpfulness,
            clarity: feedbackData.clarity,
            timestamp: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
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
        <main className="w-full">
        <div className="flex min-h-[calc(100vh-130px)] p-4 lg:p-8">
          {/* LEFT SIDE - Call Interface & Consultation Details */}
          <div className="w-full lg:w-1/2 pr-0 lg:pr-4">
              <div className="max-w-2xl w-full space-y-4 lg:space-y-6">
                <Card className="border-none shadow-2xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardContent className="p-4 lg:p-8">
                  <div className="text-center mb-8">
                      {/* Agent Avatar */}
                    <div className="relative inline-block mb-6">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 flex items-center justify-center shadow-xl mx-auto">
                        <User className="w-16 h-16 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center shadow-lg">
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{agentName}</h2>
                    <Badge variant="secondary" className={`${
                      isConnecting
                        ? 'bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-300'
                        : isCallActive
                        ? 'bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}>
                      {isConnecting ? 'Connecting...' : isCallActive ? 'Connected' : 'Ready'}
                        </Badge>
                      </div>

                  {/* Call Controls */}
                  {!isCallActive && !isConnecting ? (
                    // Start Call Button with Micro Animation
                    <div className="flex flex-col items-center gap-4 mt-8">
                      <Button
                        size="lg"
                        className="h-20 w-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-pulse"
                        onClick={handleStartCall}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <PhoneOff className="w-6 h-6 rotate-12" />
                          <span className="text-xs font-semibold">Start Call</span>
                        </div>
                      </Button>
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        Click the green button to start your consultation with Alex
                      </p>
                    </div>
                  ) : (
                    // Active Call Controls
                    <div className="flex items-center justify-center gap-4 mt-8">
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
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">TOPIC</p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">{consultation.title}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">CATEGORY</p>
                      <Badge variant="secondary" className="capitalize">{consultation.category}</Badge>
                    </div>
                    {consultation.goals && (
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">GOALS</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{consultation.goals}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

            </div>
          </div>

          {/* RIGHT SIDE - Transcript Only */}
          <div className="w-full lg:w-1/2 pl-0 lg:pl-4">
            <div className="space-y-4 lg:space-y-6">

              {/* Live Transcript - Always visible */}
              <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm h-[calc(100vh-200px)]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                    Live Transcript
                  </CardTitle>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={clearMessages}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <div className="h-full overflow-y-auto space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    {messages.length === 0 && !streamingMessage ? (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet. Start speaking to see the transcript here.</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.speaker === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <p className="text-sm font-medium mb-1">
                                {message.speaker === 'user' ? 'You' : agentName}
                              </p>
                              <p className="text-sm leading-relaxed">{message.text}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                        
                        {/* Streaming message with typing indicator */}
                        {streamingMessage && (
                          <div className={`flex ${streamingMessage.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                streamingMessage.speaker === 'user'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              <p className="text-sm font-medium mb-1">
                                {streamingMessage.speaker === 'user' ? 'You' : agentName}
                              </p>
                              <p className="text-sm leading-relaxed">
                                {streamingMessage.text}
                                <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse">|</span>
                              </p>
                              <p className="text-xs opacity-70 mt-1">
                                {streamingMessage.speaker === 'user' ? 'Speaking...' : 'Typing...'}
                              </p>
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
                  onClick={() => setShowFeedbackForm(false)}
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