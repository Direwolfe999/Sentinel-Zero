'use client';
import { motion } from 'framer-motion';
import { Copy, Download, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { AnalysisResult } from '@/types';
import { useState } from 'react';

interface Props { result: AnalysisResult; }

export function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false);
  const getRiskColor = (risk: string) => (['HIGH','MEDIUM','LOW'].includes(risk) ? (risk==='HIGH'?'from-red-500 to-rose-600':risk==='MEDIUM'?'from-yellow-500 to-orange-600':'from-green-500 to-emerald-600') : 'from-slate-500 to-slate-600');
  const getRiskIcon = (risk: string) => (risk==='HIGH'?<AlertCircle className="w-6 h-6" />:risk==='MEDIUM'?<AlertTriangle className="w-6 h-6" />:risk==='LOW'?<CheckCircle className="w-6 h-6" />:null);

  const handleCopy = () => {
    const text = `Risk: ${result.risk}\nInsight: ${result.insight}\nRecommendation: ${result.recommendation}\nConfidence: ${(result.confidence*100).toFixed(1)}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(()=>setCopied(false), 2000);
  };

  const handleDownload = () => {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.5}} className="w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
        <motion.div className={`absolute inset-0 bg-gradient-to-br ${getRiskColor(result.risk)} opacity-10`} animate={{rotate:[0,360]}} transition={{duration:20,repeat:Infinity,ease:'linear'}} />
        <div className="relative p-8 md:p-10 space-y-8">
          <motion.div className="flex items-center justify-between" initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}>
            <div className="flex items-center gap-4">
              <motion.div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getRiskColor(result.risk)} flex items-center justify-center text-white`} animate={{scale:[1,1.1,1]}} transition={{duration:2,repeat:Infinity}}>{getRiskIcon(result.risk)}</motion.div>
              <div>
                <p className="text-sm text-slate-400">Risk Level</p>
                <motion.h3 className={`text-4xl font-black bg-gradient-to-r ${getRiskColor(result.risk)} bg-clip-text text-transparent`} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}>{result.risk}</motion.h3>
              </div>
            </div>
            <motion.div className="px-4 py-2 rounded-lg bg-slate-700/50 backdrop-blur border border-slate-600" whileHover={{scale:1.05}}>
              <p className="text-xs text-slate-400">Confidence</p>
              <p className="text-xl font-bold text-white">{(result.confidence*100).toFixed(1)}%</p>
            </motion.div>
          </motion.div>

          <motion.div className="space-y-3" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.2}}>
            <h4 className="font-semibold text-slate-300 flex items-center gap-2"><span className="text-lg">💡</span>Key Insight</h4>
            <p className="text-slate-200 leading-relaxed text-lg">{result.insight}</p>
          </motion.div>

          <motion.div className="space-y-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}}>
            <h4 className="font-semibold text-blue-300 flex items-center gap-2"><span className="text-lg">🎯</span>Recommendation</h4>
            <p className="text-blue-100 leading-relaxed">{result.recommendation}</p>
          </motion.div>

          <motion.div className="flex gap-3 pt-4" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}}>
            <motion.button onClick={handleCopy} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="flex-1 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors flex items-center justify-center gap-2"><Copy className="w-4 h-4" />{copied?'Copied!':'Copy'}</motion.button>
            <motion.button onClick={handleDownload} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium transition-all flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download JSON</motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
