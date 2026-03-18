'use client';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
export function Hero() {
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.8}} className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />
      <motion.div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" animate={{y:[0,50,0]}} transition={{duration:8,repeat:Infinity}} />
      <motion.div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" animate={{y:[0,-50,0]}} transition={{duration:8,repeat:Infinity}} />
      <motion.div className="relative z-10 text-center max-w-3xl" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.3,duration:0.8}}>
        <motion.div className="flex items-center justify-center gap-3 mb-6" whileHover={{scale:1.05}}>
          <motion.div animate={{rotate:360}} transition={{duration:3,repeat:Infinity,ease:'linear'}}><Shield className="w-12 h-12 text-blue-400" /></motion.div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">SENTINEL</h1>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">ZERO</h1>
        </motion.div>
        <motion.p className="text-xl md:text-2xl text-slate-300 mb-4 font-light" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5,duration:0.8}}>AI-Powered Decision Intelligence System</motion.p>
        <motion.p className="text-lg text-slate-400 mb-8 leading-relaxed" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.7,duration:0.8}}>Analyze text, images, audio, and video across Finance, Life, and Business domains. Get instant risk assessments, actionable insights, and strategic recommendations.</motion.p>
        <motion.div className="grid grid-cols-3 gap-4 mb-12" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.9,duration:0.8}}>
          {[{l:'Finance',i:'💰'},{l:'Life',i:'🧠'},{l:'Business',i:'📊'}].map(f=><motion.div key={f.l} className="px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 backdrop-blur hover:border-blue-500/50 transition-colors" whileHover={{translateY:-5}}><div className="text-2xl mb-2">{f.i}</div><p className="text-sm text-slate-300 font-medium">{f.l} Analysis</p></motion.div>)}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
