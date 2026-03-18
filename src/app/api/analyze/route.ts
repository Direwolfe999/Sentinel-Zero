import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { analyzeInput } from '@/lib/ai';
import { preprocessInput } from '@/utils/preprocessing';
import { detectMode } from '@/utils/modeDetection';
import { AnalysisMode } from '@/types';

const Schema = z.object({
  mode: z.enum(['finance','life','business']).optional(),
  text: z.string().min(1).max(10000),
  image: z.string().optional(),
  audio: z.string().optional(),
  video: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('[ROUTE] /api/analyze called');
    const body = await request.json();
    const v = Schema.parse(body);
    
    // Auto-detect mode if not provided
    const mode = v.mode || detectMode(v.text);
    console.log('[ROUTE] Mode:', mode, ' | Text length:', v.text.length);
    
    const inputs = await preprocessInput(v.text, v.image, v.audio, v.video);
    const combined = inputs.map(i=>i.content).join('\n\n');
    console.log('[ROUTE] Calling analyzeInput with mode:', mode);
    
    const result = await analyzeInput(mode as AnalysisMode, combined);
    console.log('[ROUTE] Got result - Risk:', result.risk, 'Score:', result.riskScore);
    
    return NextResponse.json(
      { success: true, data: result, timestamp: new Date().toISOString() },
      { status: 200 }
    );
  } catch (error) {
    console.error('[ROUTE] Error:', error instanceof Error ? error.message : String(error));
    if (error instanceof z.ZodError) {
      const msg = error.issues?.[0]?.message || 'Validation failed';
      return NextResponse.json(
        { success: false, error: `Validation: ${msg}`, timestamp: new Date().toISOString() },
        { status: 400 }
      );
    }
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: msg, timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { status: 'healthy', service: 'Sentinel Zero API', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
