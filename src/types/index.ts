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
  risk: 'LOW' | 'MEDIUM' | 'HIGH';
  insight: string;
  recommendation: string;
  confidence: number;
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
