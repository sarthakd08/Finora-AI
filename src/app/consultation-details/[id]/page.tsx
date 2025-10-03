import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockCalls } from '@/lib/mock-data';
import { ArrowLeft, Calendar, Clock, Star, AlertTriangle, CheckCircle2, Target, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function CallDetailPage({ params }: { params: { id: string } }) {
  const call = mockCalls.find(c => c.id === params.id);

  if (!call) {
    notFound();
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 dark:bg-green-950/50';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50';
      case 'high': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 dark:bg-slate-900/50';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-800/90 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{call.title}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">with {call.agentName}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Call Info Card */}
        <Card className="mb-8 border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl mb-2 dark:text-white">Consultation Summary</CardTitle>
                <CardDescription className="dark:text-slate-400">{call.summary}</CardDescription>
              </div>
              <Badge 
                variant={call.status === 'completed' ? 'default' : 'secondary'}
                className={call.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900' : ''}
              >
                {call.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Date</p>
                  <p className="font-medium dark:text-white">{new Date(call.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Duration</p>
                  <p className="font-medium dark:text-white">{call.duration}</p>
                </div>
              </div>
              {call.feedback && (
                <>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Rating</p>
                      <p className="font-medium dark:text-white">{call.feedback.rating}.0 / 5.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Helpfulness</p>
                      <p className="font-medium dark:text-white">{call.feedback.helpfulness}/5</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category and Goals Card */}
        {(call.category || call.description || call.goals) && (
          <Card className="mb-8 border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Consultation Context</CardTitle>
              <CardDescription>Details provided before the call</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {call.category && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Category</h3>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 capitalize text-sm">
                    {call.category.replace('-', ' ')}
                  </Badge>
                </div>
              )}
              
              {call.description && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Description</h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                    {call.description}
                  </p>
                </div>
              )}
              
              {call.goals && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Goals
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3 border-l-4 border-blue-600">
                    {call.goals}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tabs for Report and Feedback */}
        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-1 h-auto">
            <TabsTrigger value="report" className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              Detailed Report
            </TabsTrigger>
            <TabsTrigger value="feedback" className="px-6 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white">
              Feedback
            </TabsTrigger>
          </TabsList>

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-6">
            {call.report && (
              <>
                {/* Overview */}
                <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{call.report.overview}</p>
                  </CardContent>
                </Card>

                {/* Financial Metrics */}
                {call.report.financialMetrics && (
                  <Card className="border-none shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white">
                    <CardHeader>
                      <CardTitle>Key Financial Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {call.report.financialMetrics.map((metric, index) => (
                          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                            <p className="text-sm text-white/80 mb-1">{metric.label}</p>
                            <p className="text-2xl font-bold">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Risk Assessment */}
                <Card className={`border-none shadow-lg ${getRiskColor(call.report.riskAssessment.level)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getRiskIcon(call.report.riskAssessment.level)}
                      Risk Assessment: {call.report.riskAssessment.level.toUpperCase()}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{call.report.riskAssessment.description}</p>
                  </CardContent>
                </Card>

                {/* Key Points */}
                <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Target className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      Key Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {call.report.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
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
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      </div>
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {call.report.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Items */}
                <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Target className="w-4 h-4 text-orange-600" />
                      </div>
                      Action Items
                    </CardTitle>
                    <CardDescription>Next steps to implement the recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {call.report.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 p-4 rounded-lg border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-950/30">
                          <span className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-950/300 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium dark:text-white">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            {call.feedback ? (
              <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    Client Feedback
                  </CardTitle>
                  <CardDescription>
                    Submitted on {new Date(call.feedback.timestamp).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Rating */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Overall Rating</h3>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 ${star <= call.feedback!.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`}
                        />
                      ))}
                      <span className="text-2xl font-bold text-slate-900 ml-2">{call.feedback.rating}.0</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Detailed Ratings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Helpfulness</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all"
                            style={{ width: `${(call.feedback.helpfulness / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-lg font-semibold text-slate-900">{call.feedback.helpfulness}/5</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Clarity</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all"
                            style={{ width: `${(call.feedback.clarity / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-lg font-semibold text-slate-900">{call.feedback.clarity}/5</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Comment */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Comments</h3>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border-l-4 border-blue-600">
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">&quot;{call.feedback.comment}&quot;</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
                <CardContent className="py-12 text-center">
                  <Star className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No feedback available for this consultation yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

