'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Phone, 
  User, 
  Menu,
  X,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { UserButton } from '@clerk/nextjs';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Schedule Consultation',
    href: '/call',
    icon: Phone,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Finora AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8'
                }
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out",
          "w-64 bg-white dark:bg-gray-900 border-r border-slate-200 dark:border-gray-800",
          "lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 dark:border-gray-800">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Finora AI
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400">Financial Co-Pilot</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    "hover:bg-slate-100 dark:hover:bg-gray-800",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      : "text-slate-700 dark:text-slate-300"
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section - Desktop only */}
          <div className="hidden lg:block p-4 border-t border-slate-200 dark:border-gray-800">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-gray-800">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: 'w-9 h-9'
                  }
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  My Account
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Manage profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for mobile */}
      <div className="h-16 lg:hidden" />
    </>
  );
}
