'use client';
import { motion } from 'framer-motion';
export function LoadingAnimation() {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center gap-6">
      <motion.div className="relative w-20 h-20" animate={{rotate:360}} transition={{duration:2,repeat:Infinity,ease:'linear'}}>
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="url(#gradient)" strokeWidth="4" strokeLinecap="round" strokeDasharray="70 280" />
          <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
        </svg>
        <motion.div className="absolute inset-0 flex items-center justify-center" animate={{scale:[1,1.2,1]}} transition={{duration:2,repeat:Infinity}}><div className="w-3 h-3 rounded-full bg-blue-400" /></motion.div>
      </motion.div>
      <motion.div className="text-center space-y-2" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3}}>
        <p className="text-lg font-semibold text-white">Analyzing your input...</p>
        <motion.p className="text-sm text-slate-400" animate={{opacity:[0.5,1,0.5]}} transition={{duration:1.5,repeat:Infinity}}>This may take a few seconds</motion.p>
      </motion.div>
      <div className="flex gap-2">{[0,1,2].map(i=><motion.div key={i} className="w-2 h-2 rounded-full bg-blue-400" animate={{y:[0,-8,0]}} transition={{duration:1,repeat:Infinity,delay:i*0.2}}/>)}</div>
    </motion.div>
  );
}
