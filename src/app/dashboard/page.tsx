import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockConsultations } from '@/lib/mock-data';
import { Clock, Calendar } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardPage() {
  const completedConsultations = mockConsultations.filter(consultation => consultation.status === 'completed');
  const totalDuration = completedConsultations.reduce((acc, consultation) => {
    const [minutes] = consultation.duration.split(':');
    return acc + parseInt(minutes);
  }, 0);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header - Desktop only */}
        <header className="hidden lg:block border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back! Here's your financial overview</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-slate-400">Total Consultations</CardDescription>
                <CardTitle className="text-3xl dark:text-white">{completedConsultations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">All time</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-slate-400">Total Duration</CardDescription>
                <CardTitle className="text-3xl dark:text-white">{totalDuration} min</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Average: {Math.round(totalDuration / completedConsultations.length)} min/consultation</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-slate-400">Satisfaction Rate</CardDescription>
                <CardTitle className="text-3xl dark:text-white">
                  {((completedConsultations.reduce((acc, consultation) => acc + (consultation.feedback?.rating || 0), 0) / completedConsultations.length / 5) * 100).toFixed(0)}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Based on {completedConsultations.length} reviews</p>
              </CardContent>
            </Card>
          </div>

          {/* Call History */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recent Consultations</h2>
            <p className="text-slate-600 dark:text-slate-400">Click on any consultation to view detailed report and feedback</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockConsultations.map((consultation) => (
              <Link key={consultation.id} href={`/consultation-details/${consultation.id}`}>
                <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-none bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-105 hover:bg-white dark:hover:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge 
                        variant={consultation.status === 'completed' ? 'default' : 'secondary'}
                        className={consultation.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900' : ''}
                      >
                        {consultation.status}
                      </Badge>
                      {consultation.feedback && (
                        <div className="flex items-center gap-1 text-sm dark:text-white">
                          <span className="text-yellow-500">★</span>
                          <span className="font-semibold">{consultation.feedback.rating}.0</span>
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                      {consultation.title}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1 dark:text-slate-400">
                      with {consultation.agentName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                      {consultation.summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(consultation.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{consultation.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
