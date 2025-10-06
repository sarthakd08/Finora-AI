'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Phone, 
  Mic, 
  FileText, 
  Star, 
  CheckCircle, 
  Wallet,
  BarChart3,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  Zap,
  Brain,
  MessageSquare
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: { duration: 0.5 }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Finora AI
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">Your Financial Co-Pilot</p>
            </div>
          </motion.div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignedOut>
              <Link href="/sign-in">
                <Button variant="ghost" className="dark:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                    Get Started Free
                  </Button>
                </motion.div>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button variant="ghost" className="dark:text-white">
                  Dashboard
                </Button>
              </Link>
              <Link href="/call">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Start Call
                  </Button>
                </motion.div>
              </Link>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'w-10 h-10'
                  }
                }}
              />
            </SignedIn>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-200 dark:border-blue-800"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Financial Intelligence
          </motion.div>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Your Personal
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Financial Expert
            </span>
            Available 24/7
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto"
          >
            Get real-time financial advice through voice consultations powered by advanced AI. 
            Manage your finances smarter, not harder.
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/call">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(59, 130, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 shadow-2xl">
                  <Mic className="w-5 h-5 mr-2" />
                  Start Free Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/dashboard">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 dark:border-gray-700 dark:text-white">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div 
            variants={fadeInUp}
            className="flex items-center justify-center gap-8 mt-16 text-slate-600 dark:text-slate-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium">Real-time AI Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium">Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium">Instant Insights</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need for Smart Financial Decisions
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Three powerful tools working together to transform your financial life
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: AI Voice Consultation */}
            <motion.div variants={scaleIn}>
              <Card className="group relative overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500 h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 dark:from-blue-400/10 dark:to-indigo-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl dark:text-white">AI Financial Expert</CardTitle>
                  <CardDescription className="text-base dark:text-slate-400">Voice-Powered Consultation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Have natural conversations with our AI financial expert through real-time voice calls powered by advanced AI technology.
                  </p>
                  <ul className="space-y-3">
                    {[
                      { icon: Mic, text: 'Real-time voice consultation' },
                      { icon: MessageSquare, text: 'Live transcription & chat' },
                      { icon: FileText, text: 'Auto-generated reports' },
                      { icon: Star, text: 'Goal-based personalized advice' }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2: Consultations Management */}
            <motion.div variants={scaleIn}>
              <Card className="group relative overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500 h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 dark:from-purple-400/10 dark:to-pink-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-4 shadow-lg"
                  >
                    <FileText className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl dark:text-white">Smart Dashboard</CardTitle>
                  <CardDescription className="text-base dark:text-slate-400">Consultation Management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Access all your past consultations, detailed reports, and feedback in one organized dashboard.
                  </p>
                  <ul className="space-y-3">
                    {[
                      { icon: Clock, text: 'View consultation history' },
                      { icon: FileText, text: 'Detailed financial reports' },
                      { icon: Star, text: 'Rate & provide feedback' },
                      { icon: BarChart3, text: 'Track your progress' }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3: Expenditure Management */}
            <motion.div variants={scaleIn}>
              <Card className="group relative overflow-hidden border-none shadow-xl bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-500 h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-teal-600/10 dark:from-green-400/10 dark:to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                <CardHeader>
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center mb-4 shadow-lg"
                  >
                    <Wallet className="w-8 h-8 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl dark:text-white">Expense Tracker</CardTitle>
                  <CardDescription className="text-base dark:text-slate-400">Complete Financial Control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300">
                    Track, manage, and analyze your expenses with powerful tools to maintain complete control over your finances.
                  </p>
                  <ul className="space-y-3">
                    {[
                      { icon: Wallet, text: 'Add & manage expenses' },
                      { icon: BarChart3, text: 'Visual analytics & insights' },
                      { icon: TrendingUp, text: 'Spending patterns analysis' },
                      { icon: CheckCircle, text: 'Budget recommendations' }
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 shadow-2xl">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, -90, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
              <motion.div variants={fadeInUp}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-5xl font-bold mb-2"
                >
                  24/7
                </motion.div>
                <div className="text-blue-100">AI Availability</div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-5xl font-bold mb-2"
                >
                  &lt;30s
                </motion.div>
                <div className="text-blue-100">Response Time</div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-5xl font-bold mb-2"
                >
                  100%
                </motion.div>
                <div className="text-blue-100">Secure & Private</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h3 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Transform Your Financial Future?
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10">
            Start your first AI consultation today. No credit card required.
          </p>
          <Link href="/call">
            <motion.div
              whileHover={{ scale: 1.05, boxShadow: "0 25px 60px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xl px-12 py-8 shadow-2xl">
                <Sparkles className="w-6 h-6 mr-2" />
                Get Started for Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Finora AI</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2024 Finora AI. Your AI-powered financial companion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
