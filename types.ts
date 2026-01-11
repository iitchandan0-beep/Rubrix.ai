
export enum ToolId {
  HOMEWORK_CHECK = 'homework-check',
  SOLVER = 'solver',
  AI_DETECTION = 'ai-detection',
  QA_GENERATOR = 'qa-generator',
  REWRITE_EXAM = 'rewrite-exam',
  MISTAKE_TRACKER = 'mistakes',
  HANDWRITTEN_CLEANER = 'cleaner',
  STUDY_PLAN = 'study-plan'
}

export type SolverMode = 'simple' | 'detailed';

export interface Tool {
  id: ToolId;
  title: string;
  description: string;
  icon: string;
  example: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'lite' | 'pro' | 'prep';
}

export interface HomeworkCheckResult {
  score?: number;
  rank: string;
  status: 'Correct' | 'Partially Correct' | 'Wrong';
  explanation: string;
  feedback: string;
  matches: Array<{ 
    question: string; 
    answer: string; 
    feedback: string; 
    isCorrect: boolean;
    improvedAnswer: string;
    grammarFeedback: string;
    structuralAlternatives: string[];
  }>;
}

export interface SolverResult {
  finalAnswer: string;
  steps: string[];
  explanation: string;
  tips: string;
  practiceQuestion?: string;
}

export interface AIDetectionResult {
  score: number;
  label: string;
  reasoning: string;
  suggestions: string;
}

export interface HandwrittenCleanResult {
  originalTranscription: string;
  improvedVersion: string;
  changesSummary: string;
}

export interface MistakeAnalysis {
  weaknesses: Array<{ 
    topic: string; 
    frequency: number; 
    severity: 'High' | 'Medium' | 'Low'; 
    reason: string 
  }>;
  overallTrend: string;
}

export interface StudyPlanDay {
  day: string;
  focus: string;
  tasks: string[];
  practiceQuestions: string[];
  revisionMaterial: string;
}

export interface StudyPlan {
  title: string;
  duration: string;
  schedule: StudyPlanDay[];
  expertAdvice: string;
}

// Calculator Specific Types
export type CalculatorMode = 'basic' | 'scientific' | 'algebra';

export interface CalcStep {
  id: string;
  expression: string;
  result: string;
  explanation?: string;
  isValid?: boolean;
  logicFeedback?: string;
}

export interface ValidationResult {
  isValid: boolean;
  explanation: string;
  suggestedCorrection?: string;
}

export interface FormulaSuggestion {
  name: string;
  formula: string;
  reason: string;
}
