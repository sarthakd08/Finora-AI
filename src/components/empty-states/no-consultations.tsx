'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export function NoConsultations() {
  return (
    <Card className="border-none shadow-xl bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm overflow-hidden">
      <CardContent className="py-8 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Custom SVG Illustration */}
          <div className="mb-6 relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            </div>
            
            {/* SVG Illustration */}
            <svg
              className="w-48 h-48 mx-auto relative z-10"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Folder/Document Base */}
              <path
                d="M40 60 L40 160 C40 165 45 170 50 170 L150 170 C155 170 160 165 160 160 L160 70 C160 65 155 60 150 60 L110 60 L100 50 L50 50 C45 50 40 55 40 60 Z"
                fill="url(#folder-gradient)"
                className="drop-shadow-lg"
              />
              
              {/* Empty folder indicator - dashed lines */}
              <line x1="65" y1="95" x2="135" y2="95" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-slate-300 dark:text-slate-600" />
              <line x1="65" y1="115" x2="110" y2="115" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-slate-300 dark:text-slate-600" />
              <line x1="65" y1="135" x2="125" y2="135" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-slate-300 dark:text-slate-600" />
              
              {/* Magnifying glass */}
              <circle cx="145" cy="75" r="20" fill="white" stroke="url(#glass-gradient)" strokeWidth="4" className="drop-shadow-md" />
              <line x1="158" y1="88" x2="175" y2="105" stroke="url(#glass-gradient)" strokeWidth="5" strokeLinecap="round" className="drop-shadow-md" />
              
              {/* Sparkle effects */}
              <g className="animate-pulse">
                <circle cx="30" cy="45" r="2" fill="url(#sparkle-gradient)" />
                <circle cx="170" cy="50" r="2" fill="url(#sparkle-gradient)" />
                <circle cx="180" cy="120" r="2" fill="url(#sparkle-gradient)" />
                <circle cx="25" cy="165" r="2" fill="url(#sparkle-gradient)" />
              </g>
              
              {/* Plus icon in center */}
              <g opacity="0.4">
                <circle cx="100" cy="110" r="18" fill="url(#plus-gradient)" />
                <path d="M100 98 L100 122 M88 110 L112 110" stroke="white" strokeWidth="3" strokeLinecap="round" />
              </g>
              
              {/* Gradient definitions */}
              <defs>
                <linearGradient id="folder-gradient" x1="40" y1="50" x2="160" y2="170">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="glass-gradient" x1="125" y1="55" x2="175" y2="105">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
                <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="200" y2="200">
                  <stop offset="0%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>
                <linearGradient id="plus-gradient" x1="82" y1="92" x2="118" y2="128">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#818CF8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Text Content */}
          <div className="space-y-2 mb-5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              No Consultations Yet
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Start your financial journey today! Schedule your first AI-powered consultation.
            </p>
          </div>

          {/* CTA Button */}
          <Link href="/start-consultation">
            <Button 
              size="default" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your First Consultation
            </Button>
          </Link>

          {/* Feature highlights */}
          <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                1
              </div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Expert Advice</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                2
              </div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">AI Powered</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                3
              </div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Detailed Reports</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
