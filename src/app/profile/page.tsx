import { UserProfile } from '@clerk/nextjs';
import { Sidebar } from '@/components/layout/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-slate-900">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header - Desktop only */}
        <header className="hidden lg:block border-b border-slate-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
            </div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <UserProfile 
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'shadow-xl border-0',
                }
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
