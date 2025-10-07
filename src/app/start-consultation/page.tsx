'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Phone, TrendingUp, User, CheckCircle, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserButton } from '@clerk/nextjs';
import type { Consultation } from '@/types';

export default function StartConsultationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    topic: '',
    category: '',
    goals: '',
  });

  // Demo agent name
  const agentName = 'Alex Financial AI';

  // Check if form is valid
  const isFormValid = () => {
    return formData.topic.trim() !== '' && formData.category !== '';
  };

  // Generate unique consultation ID (UUID v4)
  const generateConsultationId = () => {
    return crypto.randomUUID();
  };

  // Start consultation
  const startConsultation = () => {
    if (!isFormValid()) {
      return;
    }

    // Generate unique ID
    const consultationId = generateConsultationId();

    // Create consultation object following Consultation interface
    const newConsultation: Consultation = {
      id: consultationId,
      title: formData.topic,
      category: formData.category,
      description: formData.topic,
      goals: formData.goals,
      date: new Date().toISOString().split('T')[0],
      duration: '00:00',
      status: 'in-progress',
      agentName: agentName,
      summary: `Consultation about ${formData.topic}`,
    };

    // Console log the consultation object
    console.log('📞 New Consultation Created:', newConsultation);
    console.log('Consultation ID:', consultationId);
    console.log('Topic:', formData.topic);
    console.log('Category:', formData.category);
    console.log('Goals:', formData.goals);

    // Navigate to consultation page (only with ID)
    router.push(`/consultation/${consultationId}`);
  };

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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Start Financial Consultation</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Connect with an AI financial advisor</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Agent Info Card */}
          <Card className="border-none shadow-lg bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-1 dark:text-white">{agentName}</CardTitle>
              <CardDescription className="text-sm dark:text-slate-400">
                AI-Powered Financial Advisor specializing in portfolio management, retirement planning, and wealth optimization
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Form Card */}
          <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-white">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Consultation Details
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Tell us about your financial needs so we can provide the best advice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Topic Input */}
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-sm font-medium dark:text-white">
                  Consultation Topic <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="topic"
                  placeholder="e.g., Investment Portfolio Review, Retirement Planning"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium dark:text-white">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="dark:bg-gray-900 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Select consultation category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="investment">Investment Planning</SelectItem>
                    <SelectItem value="retirement">Retirement Planning</SelectItem>
                    <SelectItem value="tax">Tax Strategy</SelectItem>
                    <SelectItem value="estate">Estate Planning</SelectItem>
                    <SelectItem value="debt">Debt Management</SelectItem>
                    <SelectItem value="general">General Financial Advice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Goals Textarea */}
              <div className="space-y-2">
                <Label htmlFor="goals" className="text-sm font-medium dark:text-white">
                  Your Goals (Optional)
                </Label>
                <Textarea
                  id="goals"
                  placeholder="What would you like to achieve from this consultation?"
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  rows={4}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />
              </div>

              {/* What to Expect */}
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  What to Expect
                </h4>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Professional financial guidance tailored to your needs</span>
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
                onClick={startConsultation}
                disabled={!isFormValid()}
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Consultation
              </Button>
              
              {!isFormValid() && (
                <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Please fill in all required fields to start your consultation
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
