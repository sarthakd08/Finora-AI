# Finora AI - AI-Powered Financial Advisory Platform

A modern Next.js application that provides AI-powered financial advice through voice agents. Users can have consultations with AI financial advisors, receive detailed reports, and track their financial advisory history.

## Features

### 🎯 Key Functionality

- **Voice Agent Consultations**: Interactive voice-based sessions with AI financial advisors
- **Dashboard**: View all previous consultations in a beautiful card-based layout
- **Detailed Reports**: Each consultation generates comprehensive reports including:
  - Financial metrics and analysis
  - Risk assessments
  - Key insights and findings
  - Personalized recommendations
  - Actionable next steps
- **Feedback System**: Rate and provide feedback on each consultation
- **Modern UI**: Beautiful, responsive interface with gradient designs and smooth animations

### 📱 Pages

1. **Dashboard (`/`)**: 
   - Overview statistics (total consultations, duration, satisfaction rate)
   - Grid of consultation cards with quick info
   - Click any card to view details

2. **New Call (`/call`)**: 
   - Interactive voice agent interface
   - Live transcript display
   - Call controls (mute, end call, volume)
   - Real-time duration tracker

3. **Call Details (`/call/[id]`)**: 
   - Complete consultation summary
   - Tabbed interface for Reports and Feedback
   - Detailed financial metrics
   - Risk assessment visualization
   - Action items checklist

## Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Dashboard page
│   ├── call/
│   │   ├── page.tsx          # New call interface
│   │   └── [id]/
│   │       └── page.tsx      # Call detail page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
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
