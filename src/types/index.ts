/**
 * Core type definitions for SENTINEL ZERO
 */

export type AnalysisMode = 'finance' | 'life' | 'business';

export interface AnalysisInput {
  mode: AnalysisMode;
  text: string;
  image?: string; // Base64 encoded
  audio?: string; // Base64 encoded
  video?: string; // Base64 encoded
  metadata?: Record<string, unknown>;
}

export interface PreprocessedInput {
  type: 'text' | 'image' | 'audio' | 'video';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface AnalysisResult {
  // Core assessment
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number; // 0-100
  confidence: number; // 0-1
  
  // Explanation
  insight: string;
  whyRisky: string; // NEW - explains the reasoning
  patternsDetected: string[]; // NEW - e.g., ["Urgency tactics", "Unrealistic promises"]
  
  // Action
  recommendation: string;
  actionItems: {
    do: string[];
    dont: string[];
  };
  
  // Metadata
  mode: AnalysisMode;
  details?: Record<string, unknown>;
}

export interface APIResponse {
  success: boolean;
  data?: AnalysisResult;
  error?: string;
  timestamp: string;
}

export interface AnalyticsData {
  totalAnalyses: number;
  byMode: Record<AnalysisMode, number>;
  averageConfidence: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
}
