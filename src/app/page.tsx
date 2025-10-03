import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockCalls } from '@/lib/mock-data';
import { Clock, Calendar, TrendingUp, Phone } from 'lucide-react';

export default function DashboardPage() {
  const completedCalls = mockCalls.filter(call => call.status === 'completed');
  const totalDuration = completedCalls.reduce((acc, call) => {
    const [minutes] = call.duration.split(':');
    return acc + parseInt(minutes);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Finora AI
              </h1>
              <p className="text-sm text-slate-600">Financial Intelligence Agent</p>
            </div>
          </div>
          <Link href="/call">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Phone className="w-4 h-4 mr-2" />
              New Call
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Total Consultations</CardDescription>
              <CardTitle className="text-3xl">{completedCalls.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-600 font-medium">All time</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Total Duration</CardDescription>
              <CardTitle className="text-3xl">{totalDuration} min</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600 font-medium">Average: {Math.round(totalDuration / completedCalls.length)} min/call</p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription>Satisfaction Rate</CardDescription>
              <CardTitle className="text-3xl">
                {((completedCalls.reduce((acc, call) => acc + (call.feedback?.rating || 0), 0) / completedCalls.length / 5) * 100).toFixed(0)}%
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600 font-medium">Based on {completedCalls.length} reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Call History */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Recent Consultations</h2>
          <p className="text-slate-600">Click on any consultation to view detailed report and feedback</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCalls.map((call) => (
            <Link key={call.id} href={`/consultation-details/${call.id}`}>
              <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-none bg-white/80 backdrop-blur-sm hover:scale-105 hover:bg-white">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge 
                      variant={call.status === 'completed' ? 'default' : 'secondary'}
                      className={call.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                    >
                      {call.status}
                    </Badge>
                    {call.feedback && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold">{call.feedback.rating}.0</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {call.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    with {call.agentName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                    {call.summary}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(call.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{call.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
