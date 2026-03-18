import { AnalysisMode } from '@/types';

export interface DemoScenario {
    id: string;
    title: string;
    mode: AnalysisMode;
    text: string;
    description: string;
    icon: string;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
    {
        id: 'finance-pump-dump',
        title: 'Try Scam Example',
        mode: 'finance',
        description: 'Detects classic investment scam',
        icon: '💰',
        text: `Join our exclusive crypto group! 🚀 Guaranteed 300% returns in 30 days. 
Limited spots available - only 5 left! Act NOW or miss out forever. 
Send $5K to secure your spot. No questions asked. This is a one-time opportunity!`,
    },
    {
        id: 'life-unhealthy-habits',
        title: 'Try Bad Habit',
        mode: 'life',
        description: 'Identifies unhealthy patterns',
        icon: '🧠',
        text: `I work 14 hours a day, sleep 3-4 hours, skip meals often, 
never exercise, and drink 6 coffees daily to stay awake. 
I think this is normal for success. My stress levels are through the roof.`,
    },
    {
        id: 'business-comms-issue',
        title: 'Try Business Problem',
        mode: 'business',
        description: 'Flags communication inefficiency',
        icon: '📊',
        text: `We have 15 meetings daily, most with no agenda. Emails get lost constantly. 
Teams are siloed and don't communicate. We're busy but nothing gets done. 
Everyone complains about lack of focus time.`,
    },
];
