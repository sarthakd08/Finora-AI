'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Clock, Star, AlertTriangle, CheckCircle2, Target, TrendingUp, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@clerk/nextjs';
import { getConsultationById } from '@/lib/supabase/consultations';

interface DBConsultation {
  id: string;
  user_id: string;
  user_email: string;
  title: string;
  category?: string;
  description?: string;
  goals?: string;
  date: string;
  duration: string;
  status: 'in-progress' | 'completed' | 'scheduled';
  agent_name: string;
  summary: string;
  created_at: string;
  updated_at: string;
}

// Mock data for report and feedback (since not in DB yet)
const mockReport = {
  overview: "This consultation provided comprehensive financial guidance tailored to your specific needs and goals. We analyzed your current financial situation and developed actionable strategies.",
  keyPoints: [
    "Current portfolio allocation reviewed and optimized",
    "Risk tolerance assessment completed",
    "Investment strategy aligned with retirement goals",
    "Tax-efficient investment vehicles identified"
  ],
  recommendations: [
    "Increase contribution to tax-advantaged retirement accounts",
    "Diversify portfolio with international exposure",
    "Consider rebalancing quarterly to maintain target allocation",
    "Review and update beneficiary designations"
  ],
  actionItems: [
    "Schedule follow-up consultation in 3 months",
    "Open Roth IRA account by end of month",
    "Research and select 2-3 international index funds",
    "Update estate planning documents"
  ],
  riskAssessment: {
    level: 'medium' as const,
    description: "Your current investment strategy carries moderate risk, which aligns well with your time horizon and financial goals. We recommend maintaining this risk level with periodic reviews."
  },
  financialMetrics: [
    { label: "Portfolio Value", value: "$245,000" },
    { label: "Annual Return", value: "+12.5%" },
    { label: "Risk Score", value: "6.2/10" },
    { label: "Diversification", value: "85%" }
  ]
};

const mockFeedback = {
  rating: 5,
  comment: "Excellent consultation! The advisor was knowledgeable, patient, and provided clear actionable advice. I feel much more confident about my financial future.",
  helpfulness: 5,
  clarity: 5,
  timestamp: new Date().toISOString()
};

export default function ConsultationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [consultation, setConsultation] = useState<DBConsultation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  useEffect(() => {
    async function fetchConsultation() {
      try {
        setLoading(true);
        const result = await getConsultationById(id);
        
        if (result.success && result.data) {
          setConsultation(result.data);
        } else {
          setError('Consultation not found');
        }
      } catch (err) {
        console.error('Error fetching consultation:', err);
        setError('Failed to load consultation');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchConsultation();
    }
  }, [id]);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle2 className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading consultation...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !consultation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900 flex items-center justify-center">
        <Card className="max-w-md border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Consultation Not Found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'The consultation you\'re looking for doesn\'t exist.'}</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10'
                  }
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{consultation.title}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">with {consultation.agent_name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Consultation Info Card */}
        <Card className="mb-8 border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl mb-2 dark:text-white">Consultation Summary</CardTitle>
                <CardDescription className="dark:text-slate-400">{consultation.summary}</CardDescription>
              </div>
              <Badge 
                variant={consultation.status === 'completed' ? 'default' : 'secondary'}
                className={
                  consultation.status === 'completed' 
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900'
                    : consultation.status === 'in-progress'
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900'
                    : ''
                }
              >
                {consultation.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                  <p className="font-medium dark:text-white">{new Date(consultation.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="font-medium dark:text-white">{consultation.duration}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category and Goals Card */}
        {(consultation.category || consultation.description || consultation.goals) && (
          <Card className="mb-8 border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Consultation Context</CardTitle>
              <CardDescription className="dark:text-slate-400">Details provided before the call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {consultation.category && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Category</h3>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 capitalize text-sm">
                    {consultation.category.replace('-', ' ')}
                  </Badge>
                </div>
              )}
              
              {consultation.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Description</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    {consultation.description}
                  </p>
                </div>
              )}
              
              {consultation.goals && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Goals
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border-l-4 border-blue-600">
                    {consultation.goals}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs for Report and Feedback (Mock Data) */}
        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-1 h-auto">
            <TabsTrigger value="report" className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              Detailed Report
            </TabsTrigger>
            <TabsTrigger value="feedback" className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Report Tab (Mock Data) */}
          <TabsContent value="report" className="space-y-6">
            {/* Overview */}
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{mockReport.overview}</p>
              </CardContent>
            </Card>

            {/* Financial Metrics */}
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle>Key Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockReport.financialMetrics.map((metric, index) => (
                    <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-sm text-white/80 mb-1">{metric.label}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className={`border-none shadow-lg ${getRiskColor(mockReport.riskAssessment.level)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getRiskIcon(mockReport.riskAssessment.level)}
                  Risk Assessment: {mockReport.riskAssessment.level.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">{mockReport.riskAssessment.description}</p>
              </CardContent>
            </Card>

            {/* Key Points */}
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  Key Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockReport.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockReport.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Action Items */}
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <Target className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  Action Items
                </CardTitle>
                <CardDescription className="dark:text-slate-400">Next steps to implement the recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {mockReport.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/30">
                      <span className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 dark:text-white leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab (Mock Data) */}
          <TabsContent value="feedback">
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 dark:text-white">
                  <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                  Client Feedback
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Example feedback (coming soon from actual consultation data)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Overall Rating */}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Overall Rating</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-8 h-8 ${star <= mockFeedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300 dark:text-slate-700'}`}
                      />
                    ))}
                    <span className="text-2xl font-bold text-slate-900 dark:text-white ml-2">{mockFeedback.rating}.0</span>
                  </div>
                </div>

                <Separator className="dark:bg-slate-700" />

                {/* Detailed Ratings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Helpfulness</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all"
                          style={{ width: `${(mockFeedback.helpfulness / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">{mockFeedback.helpfulness}/5</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Clarity</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                          style={{ width: `${(mockFeedback.clarity / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-lg font-semibold text-slate-900 dark:text-white">{mockFeedback.clarity}/5</span>
                    </div>
                  </div>
                </div>

                <Separator className="dark:bg-slate-700" />

                {/* Comment */}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Comments</h3>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border-l-4 border-blue-600">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">&quot;{mockFeedback.comment}&quot;</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
