'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, TrendingUp, Volume2, User, FileText, Target } from 'lucide-react';

export default function NewCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string; timestamp: string }>>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<'user' | 'agent' | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    category: '',
    goals: '',
  });

  // Demo agent name
  const agentName = 'Alex Financial AI';

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if form is valid
  const isFormValid = () => {
    return formData.topic.trim() !== '' && 
           formData.category !== '';
  };

  // Start call with demo transcript
  const startCall = () => {
    if (!isFormValid()) {
      return;
    }
    
    setIsCallActive(true);
    setDuration(0);
    setCurrentSpeaker('agent');
    setTranscript([
      {
        speaker: 'agent',
        text: `Hello! I'm Alex, your AI financial advisor. I understand you want to discuss ${formData.topic}. Let me help you with that.`,
        timestamp: new Date().toISOString(),
      },
    ]);

    // Simulate conversation with speaker tracking
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
  };

  const endCall = () => {
    setIsCallActive(false);
    // In a real app, this would save the call and redirect
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Financial Consultation</h1>
              <p className="text-sm text-slate-600">Connect with an AI financial advisor</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`${isCallActive ? 'w-full h-full' : 'container mx-auto px-4 py-8 max-w-4xl'}`}>
        {!isCallActive ? (
          /* Pre-Call Screen */
          <div className="space-y-6">
            {/* Agent Info Card */}
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl mb-1">{agentName}</CardTitle>
                <CardDescription className="text-sm">
                  AI-Powered Financial Advisor specializing in portfolio management, retirement planning, and wealth optimization
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Consultation Form */}
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Consultation Details</CardTitle>
                    <CardDescription>Tell us what you'd like to discuss</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Topic Input */}
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-sm font-semibold text-slate-700">
                    Call Topic <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Investment Portfolio Review"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="bg-white"
                  />
                  <p className="text-xs text-slate-500">Give your consultation a brief title</p>
                </div>

                {/* Category Select */}
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-slate-700">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="investment">Investment Planning</SelectItem>
                      <SelectItem value="retirement">Retirement Planning</SelectItem>
                      <SelectItem value="debt">Debt Management</SelectItem>
                      <SelectItem value="tax">Tax Optimization</SelectItem>
                      <SelectItem value="savings">Savings & Budgeting</SelectItem>
                      <SelectItem value="real-estate">Real Estate & Mortgages</SelectItem>
                      <SelectItem value="insurance">Insurance Planning</SelectItem>
                      <SelectItem value="estate">Estate Planning</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">Choose the area you need help with</p>
                </div>

                {/* Goals Textarea (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="goals" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Your Goals (Optional)
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="What do you hope to achieve from this consultation?"
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="bg-white min-h-20 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-slate-500">Share your objectives for this session</p>
                </div>

                {/* What to Expect */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                  <h3 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">i</span>
                    What to expect:
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Personalized financial advice based on your specific situation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Real-time conversation with voice recognition</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Detailed report and action items after the call</span>
                    </li>
                  </ul>
                </div>

                {/* Start Button */}
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={startCall}
                  disabled={!isFormValid()}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Start Consultation
                </Button>
                
                {!isFormValid() && (
                  <p className="text-xs text-center text-slate-500">
                    Please fill in all required fields to start your consultation
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Active Call Screen - Full Screen Split Layout */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-screen">
            {/* LEFT SECTION - Voice Interface & Details */}
            <div className="bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-8 overflow-y-auto">
              <div className="max-w-2xl w-full space-y-6">
                {/* Avatars Side by Side */}
                <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-8 mb-8">
                      {/* Alex AI Agent Avatar */}
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          {/* Ripple Effect for Agent */}
                          {currentSpeaker === 'agent' && (
                            <>
                              <span className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping" />
                              <span className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse" style={{ animationDelay: '0.15s' }} />
                            </>
                          )}
                          <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl transition-all duration-300 ${
                            currentSpeaker === 'agent' ? 'scale-110 ring-4 ring-blue-400/50' : ''
                          }`}>
                            <User className="w-16 h-16 text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center shadow-lg">
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                          </div>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">{agentName}</h2>
                        <Badge variant="secondary" className={`${currentSpeaker === 'agent' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                          {currentSpeaker === 'agent' ? 'Speaking...' : 'Connected'}
                        </Badge>
                        {currentSpeaker === 'agent' && (
                          <div className="flex items-center justify-center gap-1 mt-3">
                            <div className="w-1 h-3 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="w-1 h-5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-6 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                            <div className="w-1 h-4 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        )}
                      </div>

                      {/* User Avatar */}
                      <div className="text-center">
                        <div className="relative inline-block mb-4">
                          {/* Ripple Effect for User */}
                          {currentSpeaker === 'user' && (
                            <>
                              <span className="absolute inset-0 rounded-full bg-purple-400/30 animate-ping" />
                              <span className="absolute inset-0 rounded-full bg-purple-400/20 animate-pulse" style={{ animationDelay: '0.15s' }} />
                            </>
                          )}
                          <div className={`w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl transition-all duration-300 ${
                            currentSpeaker === 'user' ? 'scale-110 ring-4 ring-purple-400/50' : ''
                          }`}>
                            <User className="w-16 h-16 text-white" />
                          </div>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-1">You</h2>
                        <Badge variant="secondary" className={`${currentSpeaker === 'user' ? 'bg-purple-100 text-purple-700' : isMuted ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                          {currentSpeaker === 'user' ? 'Speaking...' : isMuted ? 'Muted' : 'Listening'}
                        </Badge>
                        {currentSpeaker === 'user' && (
                          <div className="flex items-center justify-center gap-1 mt-3">
                            <div className="w-1 h-4 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                            <div className="w-1 h-6 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                            <div className="w-1 h-5 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
                            <div className="w-1 h-4 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-slate-200 my-6"></div>

                    {/* Call Controls & Timer */}
                    <div className="text-center">
                      <p className="text-sm text-slate-500 mb-1">Duration</p>
                      <div className="text-4xl font-mono font-bold text-slate-900 mb-6">
                        {formatDuration(duration)}
                      </div>
                      
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          size="lg"
                          variant="secondary"
                          className={`rounded-full w-14 h-14 ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-200 hover:bg-slate-300'}`}
                          onClick={toggleMute}
                        >
                          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </Button>
                        
                        <Button
                          size="lg"
                          className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
                          onClick={endCall}
                        >
                          <PhoneOff className="w-7 h-7" />
                        </Button>
                        
                        <Button
                          size="lg"
                          variant="secondary"
                          className="rounded-full w-14 h-14 bg-slate-200 hover:bg-slate-300"
                        >
                          <Volume2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Consultation Details */}
                <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Consultation Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 mb-2">Topic</h3>
                      <p className="text-base text-slate-900 font-medium">{formData.topic}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold text-slate-500 mb-2">Category</h3>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 capitalize">
                        {formData.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    {formData.goals && (
                      <div>
                        <h3 className="text-sm font-semibold text-slate-500 mb-2 flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          Goals
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/50 rounded-lg p-3">
                          {formData.goals}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <p className="text-xs text-center text-slate-500">
                  Demo interface - Real voice AI integration coming soon
                </p>
              </div>
            </div>

            {/* RIGHT SECTION - Live Transcript Only */}
            <div className="bg-white flex flex-col p-8 overflow-hidden h-screen">
              {/* Live Transcript */}
              <Card className="border-none shadow-lg bg-gradient-to-br from-slate-50 to-indigo-50 flex-1 flex flex-col overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    Live Transcript
                  </CardTitle>
                  <CardDescription>Real-time conversation</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden px-6">
                  <div className="space-y-4 h-full overflow-y-auto pr-2 pb-4">
                    {transcript.map((entry, index) => (
                      <div
                        key={index}
                        className={`flex gap-3 ${entry.speaker === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                          entry.speaker === 'agent' 
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-600' 
                            : 'bg-gradient-to-br from-purple-600 to-pink-600'
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
                              ? 'bg-white text-slate-900'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          }`}>
                            <p className="text-sm leading-relaxed">{entry.text}</p>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 px-2">
                            {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

