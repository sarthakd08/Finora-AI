'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, TrendingUp, Volume2, User } from 'lucide-react';

export default function NewCallPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<Array<{ speaker: string; text: string; timestamp: string }>>([]);

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

  // Start call with demo transcript
  const startCall = () => {
    setIsCallActive(true);
    setDuration(0);
    setTranscript([
      {
        speaker: 'agent',
        text: 'Hello! I\'m Alex, your AI financial advisor. How can I help you today?',
        timestamp: new Date().toISOString(),
      },
    ]);

    // Simulate conversation
    setTimeout(() => {
      setTranscript(prev => [...prev, {
        speaker: 'user',
        text: 'Hi Alex, I want to review my investment portfolio and discuss rebalancing options.',
        timestamp: new Date().toISOString(),
      }]);
    }, 3000);

    setTimeout(() => {
      setTranscript(prev => [...prev, {
        speaker: 'agent',
        text: 'I\'d be happy to help you review your portfolio. To provide the best advice, could you tell me about your current asset allocation and investment goals?',
        timestamp: new Date().toISOString(),
      }]);
    }, 6000);

    setTimeout(() => {
      setTranscript(prev => [...prev, {
        speaker: 'user',
        text: 'Currently I have about 70% in stocks, mostly tech companies, 20% in bonds, and 10% in cash. I\'m 42 years old and planning to retire at 65.',
        timestamp: new Date().toISOString(),
      }]);
    }, 10000);

    setTimeout(() => {
      setTranscript(prev => [...prev, {
        speaker: 'agent',
        text: 'Thank you for sharing that information. Based on your age and retirement timeline, your current allocation shows some areas for optimization. Your tech-heavy stock position creates concentration risk. Let me analyze this further and provide specific recommendations...',
        timestamp: new Date().toISOString(),
      }]);
    }, 14000);
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!isCallActive ? (
          /* Pre-Call Screen */
          <div className="space-y-6">
            <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl mb-2">{agentName}</CardTitle>
                <CardDescription className="text-base">
                  AI-Powered Financial Advisor specializing in portfolio management, retirement planning, and wealth optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">What to expect:</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
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
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>Opportunity to provide feedback on your experience</span>
                    </li>
                  </ul>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
                  onClick={startCall}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Start Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Active Call Screen */
          <div className="space-y-6">
            {/* Call Status Card */}
            <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-blue-600 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{agentName}</h2>
                  <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
                    Connected
                  </Badge>
                  <div className="text-3xl font-mono font-bold mt-4">
                    {formatDuration(duration)}
                  </div>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    size="lg"
                    variant="secondary"
                    className={`rounded-full w-16 h-16 ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-white/20 hover:bg-white/30'}`}
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </Button>
                  
                  <Button
                    size="lg"
                    className="rounded-full w-20 h-20 bg-red-500 hover:bg-red-600"
                    onClick={endCall}
                  >
                    <PhoneOff className="w-8 h-8" />
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30"
                  >
                    <Volume2 className="w-6 h-6" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Transcript */}
            <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Transcript
                </CardTitle>
                <CardDescription>Real-time conversation transcript</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {transcript.map((entry, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${entry.speaker === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                        <div className={`inline-block rounded-2xl px-4 py-3 max-w-[80%] ${
                          entry.speaker === 'agent'
                            ? 'bg-slate-100 text-slate-900'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        }`}>
                          <p className="text-sm leading-relaxed">{entry.text}</p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 px-2">
                          {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Note */}
            <div className="text-center text-sm text-slate-600">
              <p>This is a demo interface. In production, this would connect to a real voice AI service.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

