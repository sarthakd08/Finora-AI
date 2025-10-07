'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, PhoneOff, Volume2, User } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/layout/sidebar';

export default function ConsultationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const consultationId = params.id as string;
  const topic = searchParams.get('topic') || 'Financial Consultation';
  const category = searchParams.get('category') || 'general';
  const goals = searchParams.get('goals') || '';

  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string; timestamp: string }>>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'agent' | null>(null);
  
  const agentName = 'Alex Financial AI';
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize conversation
  useEffect(() => {
    setCurrentSpeaker('agent');
    setTranscript([
      {
        speaker: 'agent',
        text: `Hello! I'm Alex, your AI financial advisor. I understand you want to discuss ${topic}. Let me help you with that.`,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Simulate conversation
    setTimeout(() => {
      setCurrentSpeaker('user');
      setTranscript(prev => [...prev, {
        speaker: 'user',
        text: 'Hi Alex, I want to review my investment portfolio and discuss rebalancing options.',
        timestamp: new Date().toISOString(),
      }]);
    }, 3000);

    setTimeout(() => {
      setCurrentSpeaker('agent');
      setTranscript(prev => [...prev, {
        speaker: 'agent',
        text: 'I\'d be happy to help you review your portfolio. To provide the best advice, could you tell me about your current asset allocation and investment goals?',
        timestamp: new Date().toISOString(),
      }]);
    }, 6000);

    setTimeout(() => {
      setCurrentSpeaker('user');
      setTranscript(prev => [...prev, {
        speaker: 'user',
        text: 'Currently I have about 70% in stocks, mostly tech companies, 20% in bonds, and 10% in cash. I\'m 42 years old and planning to retire at 65.',
        timestamp: new Date().toISOString(),
      }]);
    }, 10000);

    setTimeout(() => {
      setCurrentSpeaker('agent');
      setTranscript(prev => [...prev, {
        speaker: 'agent',
        text: 'Thank you for sharing that information. Based on your age and retirement timeline, your current allocation shows some areas for optimization. Your tech-heavy stock position creates concentration risk. Let me analyze this further and provide specific recommendations...',
        timestamp: new Date().toISOString(),
      }]);
    }, 14000);
    
    setTimeout(() => {
      setCurrentSpeaker(null);
    }, 18000);
  }, [topic]);

  // Auto-scroll to bottom when transcript updates
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const endCall = () => {
    // In real app, save consultation data
    console.log('📞 Ending consultation:', consultationId);
    router.push('/dashboard');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64">
        {/* Header - Desktop only */}
        <header className="hidden lg:block border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Active Consultation</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{topic}</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Active Call Screen */}
        <main className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:h-[calc(100vh-80px)]">
            {/* LEFT SECTION */}
            <div className="bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-black flex items-center justify-center p-4 lg:p-8 min-h-[calc(100vh-130px)] lg:h-full overflow-y-auto">
              <div className="max-w-2xl w-full space-y-4 lg:space-y-6">
                <Card className="border-none shadow-2xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardContent className="p-4 lg:p-8">
                    <div className="grid grid-cols-2 gap-4 lg:gap-8 mb-4 lg:mb-8">
                      {/* Agent Avatar */}
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          {currentSpeaker === 'agent' && (
                            <>
                              <span className="absolute inset-0 rounded-full bg-slate-400/30 animate-ping" />
                              <span className="absolute inset-0 rounded-full bg-slate-400/20 animate-pulse" style={{ animationDelay: '0.15s' }} />
                            </>
                          )}
                          <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600 flex items-center justify-center shadow-xl transition-all duration-300 ${
                            currentSpeaker === 'agent' ? 'scale-110 ring-4 ring-slate-400/50 dark:ring-slate-500/50' : ''
                          }`}>
                            <User className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center shadow-lg">
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>
                        <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white mb-1">{agentName}</h2>
                        <Badge variant="secondary" className={`${currentSpeaker === 'agent' ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {currentSpeaker === 'agent' ? 'Speaking...' : 'Connected'}
                        </Badge>
                        {currentSpeaker === 'agent' && (
                          <div className="flex items-center justify-center gap-1 mt-3">
                            <div className="w-1 h-3 bg-slate-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="w-1 h-5 bg-slate-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-4 bg-slate-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-6 bg-slate-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                            <div className="w-1 h-4 bg-slate-600 dark:bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        )}
                      </div>

                      {/* User Avatar */}
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          {currentSpeaker === 'user' && (
                            <>
                              <span className="absolute inset-0 rounded-full bg-violet-400/30 animate-ping" />
                              <span className="absolute inset-0 rounded-full bg-violet-400/20 animate-pulse" style={{ animationDelay: '0.15s' }} />
                            </>
                          )}
                          <div className={`w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 flex items-center justify-center shadow-xl transition-all duration-300 ${
                            currentSpeaker === 'user' ? 'scale-110 ring-4 ring-violet-400/50 dark:ring-violet-500/50' : ''
                          }`}>
                            <User className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                          </div>
                        </div>
                        <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white mb-1">You</h2>
                        <Badge variant="secondary" className={`${currentSpeaker === 'user' ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300' : isMuted ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {currentSpeaker === 'user' ? 'Speaking...' : isMuted ? 'Muted' : 'Listening'}
                        </Badge>
                        {currentSpeaker === 'user' && (
                          <div className="flex items-center justify-center gap-1 mt-3">
                            <div className="w-1 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="w-1 h-6 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-3 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-5 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                            <div className="w-1 h-4 bg-violet-600 dark:bg-violet-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Call Controls */}
                    <div className="flex items-center justify-center gap-3 lg:gap-4 mt-6 lg:mt-8 flex-wrap">
                      <Button
                        size="default"
                        className="lg:h-12 lg:w-12"
                        variant={isMuted ? 'destructive' : 'secondary'}
                        onClick={toggleMute}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </Button>
                      <Button
                        size="default"
                        className="lg:h-12 lg:w-12 bg-red-600 hover:bg-red-700"
                        onClick={endCall}
                      >
                        <PhoneOff className="w-5 h-5" />
                      </Button>
                      <Button size="default" className="lg:h-12 lg:w-12" variant="secondary">
                        <Volume2 className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Timer */}
                    <div className="text-center mt-6">
                      <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                        {formatDuration(duration)}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Call Duration</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Consultation Details */}
                <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-base lg:text-lg dark:text-white">Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">TOPIC</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{topic}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">CATEGORY</p>
                      <Badge variant="secondary" className="capitalize">{category}</Badge>
                    </div>
                    {goals && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">GOALS</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{goals}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* RIGHT SECTION - Transcript */}
            <div className="bg-white dark:bg-gray-950 flex flex-col p-4 lg:p-8 min-h-[calc(100vh-130px)] lg:h-full">
              <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex flex-col h-full">
                <CardHeader className="pb-4 flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                    Live Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4 min-h-0">
                  {transcript.map((entry, index) => (
                    <div key={index} className={`flex gap-3 ${entry.speaker === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                        entry.speaker === 'agent' 
                          ? 'bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-500 dark:to-slate-600' 
                          : 'bg-gradient-to-br from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500'
                      }`}>
                        {entry.speaker === 'agent' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-xs font-bold">You</span>
                        )}
                      </div>
                      <div className={`flex-1 ${entry.speaker === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block rounded-2xl px-4 py-3 max-w-[85%] shadow-sm ${
                          entry.speaker === 'agent'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700'
                            : 'bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-500 dark:to-indigo-500 text-white'
                        }`}>
                          <p className="text-sm leading-relaxed">{entry.text}</p>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 px-2">
                          {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Scroll anchor */}
                  <div ref={transcriptEndRef} />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
