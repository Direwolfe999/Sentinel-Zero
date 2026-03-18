// Test if .env.local is being loaded
console.log('OPENROUTER_API_KEY available:', !!process.env.OPENROUTER_API_KEY);
console.log('API Key value (first 50 chars):', process.env.OPENROUTER_API_KEY?.substring(0, 50));
console.log('API Key length:', process.env.OPENROUTER_API_KEY?.length || 0);
