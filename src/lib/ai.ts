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
        max_tokens: 400,
      }),
    });

    if (!response.ok) return getMockResponse(mode, content);

    const data = await response.json();
    const text = data.choices[0].message.content;

    try {
      const json = JSON.parse(text);
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
      return getMockResponse(mode, content);
    }
  } catch (error) {
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
  const hasPromises = /guarantee|100%|certain|sure|promise|returns/i.test(content);
  const asksMoney = /send|pay|invest|\$|€|£|deposit|transfer/i.test(content);
  const hasStress = /stress|sleep|exercise|mental|health|busy|overwhelmed/i.test(content);
  const hasMeetings = /meeting|email|team|communication|workflow|efficient/i.test(content);

  let riskScore = 40;
  const patterns: string[] = [];
  let whyRisky = 'Pattern analysis detected concerning indicators.';
  let recommendation = 'Exercise caution and verify through official sources.';

  // Finance mode
  if (mode === 'finance') {
    if (hasUrgency) {
      riskScore += 20;
      patterns.push('Urgency tactics');
    }
    if (hasPromises) {
      riskScore += 25;
      patterns.push('Unrealistic promises');
    }
    if (asksMoney) {
      riskScore += 20;
      patterns.push('Unsolicited money request');
    }

    if (riskScore > 65) {
      whyRisky = 'This exhibits classic scam indicators: pressure tactics, unrealistic returns, and direct financial requests.';
      recommendation = 'Do NOT send money. Verify through official channels. Report to authorities.';
    }
  }

  // Life mode
  if (mode === 'life') {
    if (hasStress) {
      riskScore += 15;
      patterns.push('High stress indicators');
    }
    if (/sleep|tired|exhausted|insomnia/i.test(content)) {
      riskScore += 15;
      patterns.push('Sleep deprivation');
    }
    if (/exercise|activity|physical/i.test(content)) {
      riskScore += 10;
      patterns.push('Low physical activity');
    }

    if (riskScore > 65) {
      whyRisky = 'Your current patterns suggest significant stress and lifestyle imbalance that could impact your health.';
      recommendation = 'Prioritize sleep, exercise, and stress management. Consider speaking with a health professional.';
    }
  }

  // Business mode
  if (mode === 'business') {
    if (hasMeetings || /meeting|email/i.test(content)) {
      riskScore += 20;
      patterns.push('Meeting overload');
    }
    if (/communication|silos|lack of|inefficient/i.test(content)) {
      riskScore += 20;
      patterns.push('Communication breakdown');
    }
    if (/busy|overwhelmed|focus/i.test(content)) {
      riskScore += 15;
      patterns.push('Productivity impact');
    }

    if (riskScore > 65) {
      whyRisky = 'Current workflow structure is creating bottlenecks and reducing team productivity.';
      recommendation = 'Implement daily standups, reduce meeting overhead, and establish clear communication protocols.';
    }
  }

  if (patterns.length === 0) {
    patterns.push('Standard analysis');
  }

  return {
    risk: determineRisk(Math.min(95, riskScore)),
    riskScore: Math.min(95, riskScore),
    confidence: 0.72 + Math.random() * 0.18,
    insight: `This input has been analyzed for ${mode} context patterns and risk factors.`,
    whyRisky,
    patternsDetected: patterns,
    recommendation,
    actionItems: {
      do: ['Verify independently', 'Check official sources', 'Take your time'],
      dont: ['Rush into decisions', 'Trust unverified sources', 'Ignore red flags'],
    },
    mode,
  };
}

export async function analyzeInput(mode: AnalysisMode, content: string): Promise<AnalysisResult> {
  if (!content || content.trim().length === 0) throw new Error('Input required');
  if (content.length > 10000) content = content.substring(0, 10000) + '...';
  return callOpenRouter(mode, content);
}
