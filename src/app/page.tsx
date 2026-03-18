'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero, ModeSelector, InputArea, ResultCard, LoadingAnimation, useToast } from '@/components';
import { AnalysisMode, AnalysisResult } from '@/types';

export default function Page() {
  const [showHero, setShowHero] = useState(true);
  const [mode, setMode] = useState<AnalysisMode>('finance');
  const [text, setText] = useState('');
  const [files, setFiles] = useState<{image?:string;audio?:string;video?:string}>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { addToast } = useToast();

  const handleFile = async (type: 'image'|'audio'|'video', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const b64 = e.target?.result as string;
      setFiles(p=>({...p,[type]:b64}));
      addToast(`${type.charAt(0).toUpperCase()+type.slice(1)} uploaded`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (type: 'image'|'audio'|'video') => {
    setFiles(p=>{const n={...p};delete n[type];return n;});
  };

  const handleAnalyze = async () => {
    if (!text.trim()) { addToast('Please enter text', 'error'); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({mode,text:text.trim(),image:files.image,audio:files.audio,video:files.video}),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
        addToast('Analysis complete!', 'success');
      } else {
        addToast(data.error || 'Failed', 'error');
      }
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setText('');
    setFiles({});
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5}} className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {showHero && (
        <motion.div exit={{opacity:0,y:-100}} transition={{duration:0.6}}>
          <Hero />
          <div className="flex justify-center pb-20">
            <motion.button onClick={()=>setShowHero(false)} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold shadow-lg hover:shadow-xl transition-shadow text-lg">Start Analyzing</motion.button>
          </div>
        </motion.div>
      )}

      {!showHero && (
        <motion.div initial={{opacity:0,y:100}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="min-h-screen py-12 px-4 flex flex-col items-center justify-start">
          <div className="w-full max-w-3xl mb-12">
            <motion.button onClick={()=>setShowHero(true)} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="mb-8 px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center gap-2">← Back to Home</motion.button>
            <h2 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Sentinel Zero Analyzer</h2>
            <p className="text-slate-400 mt-2">Select a mode, enter input, and get AI-powered analysis</p>
          </div>

          <div className="w-full max-w-3xl space-y-8">
            <ModeSelector selectedMode={mode} onModeChange={setMode} />

            {!result ? (
              <>
                <InputArea text={text} onTextChange={setText} onFileUpload={handleFile} onRemoveFile={handleRemove} uploadedFiles={files} isLoading={loading} />
                {loading ? (
                  <LoadingAnimation />
                ) : (
                  <motion.button onClick={handleAnalyze} whileHover={{scale:1.05}} whileTap={{scale:0.95}} disabled={!text.trim()} className="w-full px-8 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg">🔍 Analyze Now</motion.button>
                )}
              </>
            ) : (
              <>
                <ResultCard result={result} />
                <motion.button onClick={handleNewAnalysis} whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="w-full px-8 py-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors text-lg">✨ Start New Analysis</motion.button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
