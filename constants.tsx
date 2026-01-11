
import React from 'react';
import { Tool, ToolId } from './types';

export const TOOLS: Tool[] = [
  {
    id: ToolId.HOMEWORK_CHECK,
    title: 'Homework Check',
    description: 'Check your work against an answer key to find mistakes and get helpful tips.',
    icon: '✅',
    example: 'Upload an image of my chemistry lab report and ask for feedback on the conclusion section.'
  },
  {
    id: ToolId.SOLVER,
    title: 'Homework Helper',
    description: 'Get clear answers and simple explanations for any tough homework question.',
    icon: '🧠',
    example: 'Solve x² + 5x + 6 = 0 step-by-step.'
  },
  {
    id: ToolId.STUDY_PLAN,
    title: 'Study Planner',
    description: 'Get a 7-day study plan made just for you to fix your weak spots.',
    icon: '📅',
    example: 'Create a plan to master Calculus based on my recent test errors.'
  },
  {
    id: ToolId.AI_DETECTION,
    title: 'AI Answer Checker',
    description: 'Check if an answer sounds like a real person or a robot.',
    icon: '🤖',
    example: 'Check if this paragraph about photosynthesis was written by AI.'
  },
  {
    id: ToolId.QA_GENERATOR,
    title: 'Question Maker',
    description: 'Create practice questions from your notes or answers.',
    icon: '📝',
    example: 'Generate 5 MCQ questions from this biology summary.'
  },
  {
    id: ToolId.REWRITE_EXAM,
    title: 'Exam Rewriter',
    description: 'Turn your quick notes into perfect, formal exam answers.',
    icon: '✍️',
    example: 'Convert bullet points into a structured board exam essay.'
  },
  {
    id: ToolId.MISTAKE_TRACKER,
    title: 'Mistake Tracker',
    description: 'See which topics you struggle with most and track your progress.',
    icon: '📊',
    example: 'Upload your recent test papers to see your mistakes.'
  },
  {
    id: ToolId.HANDWRITTEN_CLEANER,
    title: 'Handwriting Cleaner',
    description: 'Turn messy handwritten notes into clear, typed text.',
    icon: '🧹',
    example: 'Turn your notebook pages into clear typed text.'
  }
];
