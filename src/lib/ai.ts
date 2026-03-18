import { AnalysisMode, AnalysisResult } from '@/types';

const SYSTEM_PROMPTS: Record<AnalysisMode, string> = {
  finance: `You are a financial risk analyst specializing in fraud detection and investment scams.
ANALYZE the input for investment scams, financial fraud, and risks.

YOU MUST RESPOND WITH VALID JSON ONLY (no markdown, no extra text):
{
  "riskScore": <number 0-100>,
  "confidence": <number 0-1>,
  "insight": "<1 sentence clear verdict>",
  "whyRisky": "<1-2 sentences explaining why>",
  "patternsDetected": ["<pattern1>", "<pattern2>"],
  "recommendation": "<actionable advice>",
  "actionItems": {
    "do": ["<action1>", "<action2>"],
    "dont": ["<avoid1>", "<avoid2>"]
  }
}

LOOK FOR: Urgency tactics, unrealistic promises, requests for money upfront, lack of regulation, emotional appeals, guaranteed returns, pressure.`,
  life: `You are a behavioral health analyst specializing in lifestyle and wellness patterns.
ANALYZE the input for health, stress, habits, and well-being patterns.

YOU MUST RESPOND WITH VALID JSON ONLY (no markdown, no extra text):
{
  "riskScore": <number 0-100>,
  "confidence": <number 0-1>,
  "insight": "<Summary of health/lifestyle state>",
  "whyRisky": "<Why this pattern is concerning>",
  "patternsDetected": ["<pattern1>", "<pattern2>"],
  "recommendation": "<Specific improvement strategy>",
  "actionItems": {
    "do": ["<start doing>", "<prioritize>"],
    "dont": ["<stop doing>", "<avoid>"]
  }
}

FOCUS ON: Sleep quality, exercise, stress levels, work-life balance, relationships, nutrition, mental health.`,
  business: `You are a workflow efficiency consultant specializing in business operations.
ANALYZE the input for communication, workflow, and productivity issues.

YOU MUST RESPOND WITH VALID JSON ONLY (no markdown, no extra text):
{
  "riskScore": <number 0-100>,
  "confidence": <number 0-1>,
  "insight": "<Current state assessment>",
  "whyRisky": "<Impact of inefficiency>",
  "patternsDetected": ["<pattern1>", "<pattern2>"],
  "recommendation": "<Process improvement strategy>",
  "actionItems": {
    "do": ["<implement>", "<establish>"],
    "dont": ["<stop>", "<eliminate>"]
  }
}

FOCUS ON: Communication flow, meeting efficiency, decision-making, team alignment, process clarity, collaboration tools.`,
};

async function callOpenRouter(mode: AnalysisMode, content: string): Promise<AnalysisResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  console.log('[AI] Attempting OpenRouter API call');
  console.log('[AI] API Key available:', !!apiKey);
  console.log('[AI] API Key length:', apiKey?.length || 0);

  if (!apiKey) {
    console.log('[AI] No API key found, using mock response');
    return getMockResponse(mode, content);
  }

  try {
    console.log('[AI] Calling OpenRouter API...');

    const requestBody = {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS[mode] },
        { role: 'user', content: content || 'Analyze this input' },
      ],
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.9,
    };

    console.log('[AI] Request body:', JSON.stringify(requestBody, null, 2).substring(0, 200));

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://sentinel-zero.com',
        'X-Title': 'Sentinel Zero',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('[AI] OpenRouter response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('[AI] API error details:', errorText.substring(0, 300));
      console.log('[AI] API error status:', response.status, 'using mock response');
      return getMockResponse(mode, content);
    }

    const data = await response.json();
    console.log('[AI] API response received successfully');

    if (!data.choices?.[0]?.message?.content) {
      console.log('[AI] Invalid response format, using mock');
      return getMockResponse(mode, content);
    }

    const text = data.choices[0].message.content;
    console.log('[AI] Response text (first 100 chars):', text.substring(0, 100));

    try {
      const json = JSON.parse(text);
      console.log('[AI] Successfully parsed JSON response');
      return {
        risk: json.risk || determineRisk(json.riskScore),
        riskScore: json.riskScore || 50,
        confidence: json.confidence || 0.75,
        insight: json.insight || 'Analysis completed',
        whyRisky: json.whyRisky || 'Pattern detected',
        patternsDetected: json.patternsDetected || [],
        recommendation: json.recommendation || 'Review and verify',
        actionItems: json.actionItems || { do: ['Verify'], dont: ['Rush'] },
        mode,
      };
    } catch (parseError) {
      console.log('[AI] JSON parse error:', (parseError as Error).message);
      return getMockResponse(mode, content);
    }
  } catch (error) {
    console.error('[AI] OpenRouter API error:', error instanceof Error ? error.message : String(error));
    console.log('[AI] Falling back to mock response');
    return getMockResponse(mode, content);
  }
}

function determineRisk(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

function getMockResponse(mode: AnalysisMode, content: string): AnalysisResult {
  const hasUrgency = /urgent|now|immediately|limited|act fast|don't wait/i.test(content);
  const hasPromises = /guaranteed|100%|promise|sure|certain|definitely/i.test(content);
  const hasMoneyRequest = /money|send|transfer|invest|buy|pay|crypto|bitcoin/i.test(content);
  const hasStress = /stress|anxious|worried|tired|burn|exhausted/i.test(content);
  const hasSleep = /sleep|insomnia|tired|rest|night/i.test(content);
  const hasExercise = /exercise|gym|workout|run|fitness|sports/i.test(content);
  const hasMeetings = /meeting|call|sync|standup|discussion|conference/i.test(content);
  const hasComms = /email|slack|message|communication|chat|notify/i.test(content);
  const hasFocus = /focus|distraction|productive|concentrate|attention/i.test(content);

  let riskScore = 40;
  const patterns: string[] = [];
  const doItems: string[] = [];
  const dontItems: string[] = [];

  if (mode === 'finance') {
    if (hasUrgency) { riskScore += 20; patterns.push('Urgency tactics'); }
    if (hasPromises) { riskScore += 25; patterns.push('Unrealistic promises'); }
    if (hasMoneyRequest) { riskScore += 20; patterns.push('Unsolicited money request'); }
    doItems.push('Verify independently', 'Check official sources', 'Take your time');
    dontItems.push('Rush into decisions', 'Trust unverified sources', 'Ignore red flags');
  } else if (mode === 'life') {
    if (hasStress) { riskScore += 15; patterns.push('High stress indicators'); }
    if (hasSleep) { riskScore += 15; patterns.push('Sleep deprivation'); }
    if (!hasExercise) { riskScore += 10; patterns.push('Lack of exercise'); }
    doItems.push('Prioritize sleep', 'Exercise regularly', 'Practice stress management');
    dontItems.push('Skip rest days', 'Ignore stress signals', 'Neglect health');
  } else if (mode === 'business') {
    if (hasMeetings) { riskScore += 20; patterns.push('Meeting overload'); }
    if (hasComms) { riskScore += 20; patterns.push('Communication inefficiency'); }
    if (!hasFocus) { riskScore += 15; patterns.push('Focus fragmentation'); }
    doItems.push('Implement async communication', 'Batch meetings', 'Set focus time');
    dontItems.push('Schedule back-to-back calls', 'React to every notification', 'Skip planning');
  }

  riskScore = Math.min(100, Math.max(0, riskScore));
  const confidence = 0.72 + Math.random() * 0.18;

  return {
    risk: determineRisk(riskScore),
    riskScore,
    confidence,
    insight: `This input has been analyzed for ${mode} context patterns and risk factors.`,
    whyRisky: `Pattern analysis detected concerning indicators relevant to ${mode} decisions.`,
    patternsDetected: patterns.length > 0 ? patterns : ['Pattern detected'],
    recommendation: `Exercise caution in this ${mode} context. Verify information and seek expert guidance if needed.`,
    actionItems: {
      do: doItems,
      dont: dontItems,
    },
    mode,
  };
}

export async function analyzeInput(mode: AnalysisMode, content: string): Promise<AnalysisResult> {
  if (!content || content.trim().length === 0) throw new Error('Input required');
  if (content.length > 10000) content = content.substring(0, 10000) + '...';
  return callOpenRouter(mode, content);
}
