'use client';
import { motion } from 'framer-motion';
import { AnalysisMode } from '@/types';
import { Zap, Brain, TrendingUp } from 'lucide-react';

interface Props { selectedMode: AnalysisMode; onModeChange: (m: AnalysisMode) => void; }

const MODES = [
  { id: 'finance' as const, label: 'Finance', description: 'Scam & Risk Detection', icon: <TrendingUp className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
  { id: 'life' as const, label: 'Life', description: 'Behavior & Insights', icon: <Brain className="w-5 h-5" />, color: 'from-purple-500 to-pink-500' },
  { id: 'business' as const, label: 'Business', description: 'Workflow Analysis', icon: <Zap className="w-5 h-5" />, color: 'from-blue-500 to-cyan-500' },
];

export function ModeSelector({ selectedMode, onModeChange }: Props) {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Analysis Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MODES.map((m, i) => (
          <motion.button key={m.id} onClick={()=>onModeChange(m.id)} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.1,duration:0.5}} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className={`relative p-6 rounded-xl transition-all duration-300 group ${selectedMode===m.id ? `bg-gradient-to-br ${m.color} text-white shadow-xl` : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-600'}`}>
            {selectedMode===m.id && <motion.div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${m.color} opacity-20 blur-lg -z-10`} animate={{scale:[1,1.1,1]}} transition={{duration:2,repeat:Infinity}} />}
            <div className="flex flex-col items-center gap-3">
              <motion.div className={selectedMode===m.id?'text-white':'text-slate-400'}>{m.icon}</motion.div>
              <h3 className="font-bold text-lg">{m.label}</h3>
              <p className={`text-xs ${selectedMode===m.id?'opacity-90':'text-slate-500'}`}>{m.description}</p>
            </div>
            {selectedMode===m.id && <motion.div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center" initial={{scale:0}} animate={{scale:1}}><svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></motion.div>}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
