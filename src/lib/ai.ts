import { AnalysisMode, AnalysisResult } from '@/types';

const SYSTEM_PROMPTS: Record<AnalysisMode, string> = {
  finance: `You are a financial analyst. Analyze for fraud, risks, scams. Respond ONLY as JSON: {"risk":"LOW|MEDIUM|HIGH","insight":"","recommendation":"","confidence":0.0}`,
  life: `You are a life coach. Analyze behaviors, habits, growth. Respond ONLY as JSON: {"risk":"LOW|MEDIUM|HIGH","insight":"","recommendation":"","confidence":0.0}`,
  business: `You are a business consultant. Analyze workflows, efficiency, communication. Respond ONLY as JSON: {"risk":"LOW|MEDIUM|HIGH","insight":"","recommendation":"","confidence":0.0}`,
};

async function callOpenRouter(mode: AnalysisMode, content: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return getMockResponse(mode, content);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-2-7b-chat:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPTS[mode] },
          { role: 'user', content },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) return getMockResponse(mode, content);
    const data = await response.json();
    const text = data.choices[0].message.content;
    const json = JSON.parse(text);
    return {
      risk: json.risk || 'MEDIUM',
      insight: json.insight || 'Analysis completed',
      recommendation: json.recommendation || 'Review and verify',
      confidence: json.confidence || 0.7,
    };
  } catch (error) {
    return getMockResponse(mode, content);
  }
}

function getMockResponse(mode: AnalysisMode, content: string): AnalysisResult {
  const responses: Record<AnalysisMode, Record<string, AnalysisResult>> = {
    finance: {
      high: { risk: 'HIGH', insight: 'Red flags detected: guaranteed returns, pressure, unsolicited.', recommendation: 'Avoid and verify through official channels.', confidence: 0.92 },
      medium: { risk: 'MEDIUM', insight: 'Some concerning elements: unverified sources, unclear terms.', recommendation: 'Request documentation and verify credentials.', confidence: 0.75 },
      low: { risk: 'LOW', insight: 'No major financial red flags detected.', recommendation: 'Proceed with standard due diligence.', confidence: 0.88 },
    },
    life: {
      high: { risk: 'HIGH', insight: 'Significant stress indicators and isolation.', recommendation: 'Consider professional support and self-care.', confidence: 0.79 },
      medium: { risk: 'MEDIUM', insight: 'Moderate stress with some positive habits.', recommendation: 'Develop better routines and boundaries.', confidence: 0.82 },
      low: { risk: 'LOW', insight: 'Healthy habits and balanced lifestyle.', recommendation: 'Continue current practices.', confidence: 0.85 },
    },
    business: {
      high: { risk: 'HIGH', insight: 'Critical workflow issues and communication gaps.', recommendation: 'Implement daily stand-ups and clarity tools.', confidence: 0.87 },
      medium: { risk: 'MEDIUM', insight: 'Some inefficiencies in processes.', recommendation: 'Streamline approvals and prioritization.', confidence: 0.80 },
      low: { risk: 'LOW', insight: 'Well-organized workflows and clear processes.', recommendation: 'Maintain current practices.', confidence: 0.86 },
    },
  };

  const contentLower = content.toLowerCase();
  let level: 'low' | 'medium' | 'high' = 'medium';
  if (contentLower.includes('urgent') || contentLower.includes('guaranteed') || contentLower.length < 50) level = 'high';
  else if (contentLower.includes('verified') || contentLower.includes('confirmed')) level = 'low';

  return responses[mode][level];
}

export async function analyzeInput(mode: AnalysisMode, content: string): Promise<AnalysisResult> {
  if (!content || content.trim().length === 0) throw new Error('Input required');
  if (content.length > 10000) content = content.substring(0, 10000) + '...';
  return callOpenRouter(mode, content);
}
