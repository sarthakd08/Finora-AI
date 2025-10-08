'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Loader2 } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Sidebar } from '@/components/layout/sidebar';
import { getConsultations } from '@/lib/supabase/consultations';
import { NoConsultations } from '@/components/empty-states/no-consultations';

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

export default function DashboardPage() {
  const { user } = useUser();
  const [consultations, setConsultations] = useState<DBConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConsultations() {
      if (!user) return;
      
      try {
        setLoading(true);
        const result = await getConsultations();
        
        if (result.success) {
          setConsultations(result.data);
        } else {
          setError('Failed to load consultations');
        }
      } catch (err) {
        console.error('Error fetching consultations:', err);
        setError('Failed to load consultations');
      } finally {
        setLoading(false);
      }
    }

    fetchConsultations();
  }, [user]);

  // Calculate stats
  const completedConsultations = consultations.filter(c => c.status === 'completed');
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
              <p className="text-sm text-slate-600 dark:text-slate-400">Welcome back! Here&apos;s your financial overview</p>
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
                <CardTitle className="text-3xl dark:text-white">{consultations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">All time</p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-slate-400">Total Duration</CardDescription>
                <CardTitle className="text-3xl dark:text-white">
                  {totalDuration > 0 ? `${totalDuration} min` : '0 min'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {completedConsultations.length > 0 
                    ? `Average: ${Math.round(totalDuration / completedConsultations.length)} min/consultation`
                    : 'No completed consultations yet'
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardDescription className="dark:text-slate-400">Completed</CardDescription>
                <CardTitle className="text-3xl dark:text-white">{completedConsultations.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                  {consultations.length - completedConsultations.length} in progress
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Consultations Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Recent Consultations</h2>
            <p className="text-slate-600 dark:text-slate-400">Click on any consultation to view detailed information</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30">
              <CardContent className="py-6">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!loading && !error && consultations.length === 0 && (
            <NoConsultations />
          )}

          {/* Consultations Grid */}
          {!loading && !error && consultations.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations.map((consultation) => (
                <Link key={consultation.id} href={`/consultation-details/${consultation.id}`}>
                  <Card className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-none bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm hover:scale-105 hover:bg-white dark:hover:bg-gray-800">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
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
                      <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                        {consultation.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1 dark:text-slate-400">
                        with {consultation.agent_name}
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
          )}
        </main>
      </div>
    </div>
  );
}
