export interface Call {
  id: string;
  title: string;
  category?: string;
  description?: string;
  goals?: string;
  date: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  agentName: string;
  summary: string;
  feedback?: Feedback;
  report?: Report;
}

export interface Feedback {
  rating: number;
  comment: string;
  helpfulness: number;
  clarity: number;
  timestamp: string;
}

export interface Report {
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

