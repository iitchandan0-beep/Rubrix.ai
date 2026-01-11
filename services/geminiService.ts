
import { GoogleGenAI, Type } from "@google/genai";
import { ToolId, HomeworkCheckResult, SolverResult, AIDetectionResult, MistakeAnalysis, StudyPlan, HandwrittenCleanResult, SolverMode, CalcStep, ValidationResult, FormulaSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  // Existing methods...
  async analyzeHomework(questions: string, answers: string, image?: string): Promise<HomeworkCheckResult> {
    const prompt = `Act as an expert Academic Reviewer and Linguist. Evaluate the following homework submission.
    Questions: ${questions}
    Student's Answers: ${answers}
    Return a structured JSON evaluation.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: image ? { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } }] } : prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            score: { type: Type.NUMBER },
            rank: { type: Type.STRING },
            explanation: { type: Type.STRING },
            feedback: { type: Type.STRING },
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                  feedback: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  improvedAnswer: { type: Type.STRING },
                  grammarFeedback: { type: Type.STRING },
                  structuralAlternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['question', 'answer', 'feedback', 'isCorrect', 'improvedAnswer', 'grammarFeedback', 'structuralAlternatives']
              }
            }
          },
          required: ['status', 'score', 'rank', 'explanation', 'feedback', 'matches']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async solveHomework(query: string, mode: SolverMode = 'detailed', image?: string): Promise<SolverResult> {
    const prompt = `Solve this homework problem. Mode: ${mode}. Problem: ${query}`;
    const response = await ai.models.generateContent({
      model: mode === 'detailed' ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview',
      contents: image ? { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } }] } : prompt,
      config: {
        thinkingConfig: { thinkingBudget: mode === 'simple' ? 0 : 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            finalAnswer: { type: Type.STRING },
            steps: { type: Type.ARRAY, items: { type: Type.STRING } },
            explanation: { type: Type.STRING },
            tips: { type: Type.STRING },
            practiceQuestion: { type: Type.STRING }
          },
          required: ['finalAnswer', 'steps', 'explanation', 'tips']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async detectAI(text: string): Promise<AIDetectionResult> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Check if this text is human or AI: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            label: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            suggestions: { type: Type.STRING }
          },
          required: ['score', 'label', 'reasoning', 'suggestions']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async cleanHandwriting(image: string): Promise<HandwrittenCleanResult> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Read the handwriting in this image. Give a typed version and a slightly cleaned up version with better spelling." },
          { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            originalTranscription: { type: Type.STRING },
            improvedVersion: { type: Type.STRING },
            changesSummary: { type: Type.STRING }
          },
          required: ['originalTranscription', 'improvedVersion', 'changesSummary']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async analyzeMistakes(text: string, image?: string): Promise<MistakeAnalysis & { trendPoints: number[] }> {
    const prompt = `Look at these student mistakes. Mistake Data: ${text}.`;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: image ? { parts: [{ text: prompt }, { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } }] } : prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weaknesses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  frequency: { type: Type.NUMBER },
                  severity: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ['topic', 'frequency', 'severity', 'reason']
              }
            },
            overallTrend: { type: Type.STRING },
            trendPoints: { type: Type.ARRAY, items: { type: Type.NUMBER } }
          },
          required: ['weaknesses', 'overallTrend', 'trendPoints']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  async generateStudyPlan(mistakeData: string | MistakeAnalysis): Promise<StudyPlan> {
    const dataStr = typeof mistakeData === 'string' ? mistakeData : JSON.stringify(mistakeData);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Make a study plan based on: ${dataStr}`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            duration: { type: Type.STRING },
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                  practiceQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                  revisionMaterial: { type: Type.STRING }
                },
                required: ['day', 'focus', 'tasks', 'practiceQuestions', 'revisionMaterial']
              }
            },
            expertAdvice: { type: Type.STRING }
          },
          required: ['title', 'duration', 'schedule', 'expertAdvice']
        }
      }
    });
    return JSON.parse(response.text || '{}');
  },

  // --- NEW CALCULATOR AI SERVICES ---

  async validateCalcSteps(steps: CalcStep[]): Promise<ValidationResult[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Validate the following mathematical steps for logical flow and correctness. Provide an explanation for each transition.
      Steps: ${JSON.stringify(steps)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              isValid: { type: Type.BOOLEAN },
              explanation: { type: Type.STRING, description: 'Exam-friendly explanation of why this step is correct or incorrect.' },
              suggestedCorrection: { type: Type.STRING }
            },
            required: ['isValid', 'explanation']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  },

  async getFormulaSuggestions(context: string): Promise<FormulaSuggestion[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest context-aware math/science formulas for this problem: "${context}". Include names, LaTeX formulas, and reasons for applicability.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              formula: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ['name', 'formula', 'reason']
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  },

  async importEquationFromImage(image: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Extract the mathematical equation or expression from this image. Only return the string representation (e.g., x^2 + 5x = 0)." },
          { inlineData: { mimeType: 'image/jpeg', data: image.split(',')[1] } }
        ]
      }
    });
    return response.text || '';
  }
};
