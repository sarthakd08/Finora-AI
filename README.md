# Finora AI - AI-Powered Financial Advisory Platform

A modern Next.js application that provides AI-powered financial advice through voice agents. Users can have consultations with AI financial advisors, receive detailed reports, and track their financial advisory history.

## Features

### 🎯 Key Functionality

- **🔐 Authentication**: Secure user authentication powered by Clerk
  - Sign up / Sign in with email or social providers
  - Protected routes for authenticated users
  - User profile management with UserButton
  - Automatic redirection after authentication
- **🎙️ Voice Agent Consultations**: Interactive voice-based sessions with AI financial advisors
  - Pre-call form to set consultation goals
  - Real-time voice interface with speaking indicators
  - Live transcription during calls
  - Split-screen layout for better UX
- **📊 Dashboard**: View all previous consultations in a beautiful card-based layout
  - Statistics overview (total consultations, duration, satisfaction rate)
  - Filterable consultation cards
  - Quick access to consultation details
- **📑 Detailed Reports**: Each consultation generates comprehensive reports including:
  - Financial metrics and analysis
  - Risk assessments with visual indicators
  - Key insights and findings
  - Personalized recommendations
  - Actionable next steps with checkboxes
- **⭐ Feedback System**: Rate and provide feedback on each consultation
- **🎨 Modern UI**: Beautiful, responsive interface with:
  - Gradient designs and glass morphism effects
  - Smooth animations with Framer Motion
  - Dark mode support with theme toggle
  - Mobile-responsive design

### 📱 Pages

1. **Landing Page (`/`)**: 
   - Beautiful hero section with animations
   - Feature showcase
   - Sign in/Sign up for new users
   - Quick access to dashboard for authenticated users

2. **Dashboard (`/dashboard`)**: 
   - Overview statistics (total consultations, duration, satisfaction rate)
   - Grid of consultation cards with quick info
   - Click any card to view details
   - Protected route (requires authentication)

3. **New Call (`/call`)**: 
   - Pre-call form for consultation topic, category, and goals
   - Interactive voice agent interface with split layout
   - Side-by-side avatars with speaking indicators
   - Live transcript display
   - Call controls (mute, end call, volume)
   - Real-time duration tracker
   - Protected route (requires authentication)

4. **Consultation Details (`/consultation-details/[id]`)**: 
   - Complete consultation summary
   - Tabbed interface for Reports and Feedback
   - Detailed financial metrics
   - Risk assessment visualization
   - Action items checklist
   - Protected route (requires authentication)

5. **Authentication Pages**:
   - **Sign In (`/sign-in`)**: User login
   - **Sign Up (`/sign-up`)**: New user registration

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Authentication**: Clerk
- **Animations**: Framer Motion
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables (see below)

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Environment Setup

Create a `.env.local` file in the root directory with your Clerk credentials:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

**How to get Clerk keys:**
1. Visit [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Go to "API Keys" in the sidebar
4. Copy your Publishable Key and Secret Key

⚠️ **Important**: After adding environment variables, you **must restart your development server** for changes to take effect.

📖 See **`SETUP_GUIDE.md`** for detailed step-by-step authentication setup instructions and troubleshooting.

## Project Structure

```
src/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── (auth)/                           # Auth route group (no URL segment)
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx              # Sign in page
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx              # Sign up page
│   ├── dashboard/
│   │   └── page.tsx                      # Dashboard (protected)
│   ├── call/
│   │   └── page.tsx                      # New call interface (protected)
│   ├── consultation-details/
│   │   └── [id]/
│   │       └── page.tsx                  # Consultation detail page (protected)
│   ├── layout.tsx                        # Root layout with ClerkProvider
│   └── globals.css                       # Global styles
├── components/
│   └── ui/                   # shadcn/ui components
├── lib/
│   ├── utils.ts              # Utility functions
│   └── mock-data.ts          # Mock consultation data
└── types/
    └── index.ts              # TypeScript type definitions
```

## Data Structure

### Call Type
```typescript
interface Call {
  id: string;
  title: string;
  date: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  agentName: string;
  summary: string;
  feedback?: Feedback;
  report?: Report;
}
```

### Report Type
```typescript
interface Report {
  overview: string;
  keyPoints: string[];
  recommendations: string[];
  actionItems: string[];
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    description: string;
  };
  financialMetrics?: {
    label: string;
    value: string;
  }[];
}
```

### Feedback Type
```typescript
interface Feedback {
  rating: number;
  comment: string;
  helpfulness: number;
  clarity: number;
  timestamp: string;
}
```

## Current Implementation

This version includes:
- ✅ Complete UI/UX design
- ✅ Mock data for 6 sample consultations
- ✅ Responsive layouts for all screen sizes
- ✅ Interactive call interface with demo transcript
- ✅ Detailed report visualization
- ✅ Feedback display system

## Future Enhancements

To make this a production-ready application, consider adding:

1. **Backend Integration**
   - Real voice AI API integration (e.g., OpenAI Whisper, Google Speech-to-Text)
   - Database for storing calls and reports (PostgreSQL, MongoDB)
   - Authentication system (NextAuth.js)

2. **Voice Features**
   - Real-time speech recognition
   - Text-to-speech for AI responses
   - Audio recording and playback

3. **AI Integration**
   - OpenAI GPT-4 for financial advice
   - Custom financial analysis algorithms
   - Real-time market data integration

4. **Additional Features**
   - User profiles and accounts
   - Calendar for scheduling consultations
   - Email notifications
   - PDF report generation
   - Analytics dashboard
   - Payment integration

## Design Philosophy

The UI follows modern design principles:
- **Gradient Accents**: Blue to indigo gradients for primary actions
- **Glass Morphism**: Backdrop blur effects for depth
- **Card-Based Layout**: Clean, organized information display
- **Color-Coded Status**: Visual indicators for risk levels and ratings
- **Smooth Animations**: Hover effects and transitions for better UX

## Contributing

This is a demo application. Feel free to fork and customize for your needs.

## License

MIT License - feel free to use this project as a starting point for your financial advisory platform.
