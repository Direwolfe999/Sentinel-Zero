export function detectMode(text: string): 'finance' | 'life' | 'business' {
    const financeKeywords = [
        'money',
        'invest',
        'crypto',
        'stock',
        'loan',
        'bank',
        'payment',
        'scam',
        'returns',
        'profit',
        'guaranteed',
        'returns',
        'financial',
        'trading',
    ];
    const lifeKeywords = [
        'habit',
        'health',
        'sleep',
        'exercise',
        'mental',
        'stress',
        'anxiety',
        'relationship',
        'daily',
        'work-life',
        'wellness',
        'physical',
        'emotional',
    ];
    const businessKeywords = [
        'meeting',
        'team',
        'project',
        'deadline',
        'workflow',
        'email',
        'client',
        'communication',
        'efficiency',
        'productivity',
        'collaboration',
        'work',
        'office',
    ];

    const lowerText = text.toLowerCase();

    const financeScore = financeKeywords.filter(k => lowerText.includes(k)).length;
    const lifeScore = lifeKeywords.filter(k => lowerText.includes(k)).length;
    const businessScore = businessKeywords.filter(k => lowerText.includes(k)).length;

    if (financeScore >= lifeScore && financeScore >= businessScore && financeScore > 0) {
        return 'finance';
    } else if (businessScore >= lifeScore && businessScore > 0) {
        return 'business';
    } else {
        return 'life';
    }
}
