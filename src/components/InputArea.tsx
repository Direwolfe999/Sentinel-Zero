'use client';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useState, useRef } from 'react';

interface Props { text: string; onTextChange: (t: string) => void; onFileUpload: (type: 'image'|'audio'|'video', file: File) => void; onRemoveFile: (type: 'image'|'audio'|'video') => void; uploadedFiles: {image?:string;audio?:string;video?:string}; isLoading: boolean; }

const FILE_TYPES = {
  image: { accept: 'image/*', icon: '🖼️', label: 'Image' },
  audio: { accept: 'audio/*', icon: '🎵', label: 'Audio' },
  video: { accept: 'video/*', icon: '🎬', label: 'Video' },
};

export function InputArea({ text, onTextChange, onFileUpload, onRemoveFile, uploadedFiles, isLoading }: Props) {
  const refs = {
    image: useRef<HTMLInputElement>(null),
    audio: useRef<HTMLInputElement>(null),
    video: useRef<HTMLInputElement>(null),
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image'|'audio'|'video') => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(type, file);
  };

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}} className="w-full max-w-3xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-300">Your Input</label>
        <textarea value={text} onChange={(e)=>onTextChange(e.target.value)} placeholder="Describe your concern..." disabled={isLoading} className="w-full h-40 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed" />
        <p className="text-xs text-slate-500">{text.length} / 10000 characters</p>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-300">Media (Optional)</label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(FILE_TYPES) as Array<'image'|'audio'|'video'>).map(type => (
            <motion.div key={type} whileHover={{scale:uploadedFiles[type]?1:1.02}}>
              <input ref={refs[type]} type="file" accept={FILE_TYPES[type].accept} onChange={(e)=>handleFile(e,type)} disabled={isLoading} className="hidden" />
              {!uploadedFiles[type] ? (
                <button onClick={()=>refs[type].current?.click()} disabled={isLoading} className="w-full px-4 py-4 rounded-lg border-2 border-dashed border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50 text-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2">
                  <Upload className="w-5 h-5" />
                  <span className="text-sm font-medium">{FILE_TYPES[type].label}</span>
                </button>
              ) : (
                <motion.div className="w-full px-4 py-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 flex items-center justify-between" initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}}>
                  <span className="text-green-400 text-sm font-medium">✓ {FILE_TYPES[type].label}</span>
                  <button onClick={()=>onRemoveFile(type)} disabled={isLoading} className="text-green-400 hover:text-red-400 transition-colors disabled:opacity-50"><X className="w-4 h-4" /></button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
