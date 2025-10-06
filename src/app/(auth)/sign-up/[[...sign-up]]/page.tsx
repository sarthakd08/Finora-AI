import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          Join Finora AI
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Create your account and start your financial journey
        </p>
      </div>
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 
              'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
            card: 'shadow-2xl',
            headerTitle: 'hidden',
            headerSubtitle: 'hidden',
            phoneInputBox: 'hidden',
            formFieldInput__phoneNumber: 'hidden'
          }
        }}
        routing="hash"
        signInUrl="/sign-in"
      />
    </div>
  );
}

