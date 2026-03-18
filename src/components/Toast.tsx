'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useCallback, createContext, useContext, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';
interface Toast { id: string; message: string; type: ToastType; }
interface ToastContextValue { addToast: (m: string, t: ToastType) => void; toasts: Toast[]; removeToast: (id: string) => void; }

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div key={t.id} initial={{opacity:0,y:20,x:100}} animate={{opacity:1,y:0,x:0}} exit={{opacity:0,y:20,x:100}} transition={{duration:0.3}} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg backdrop-blur ${t.type==='success'?'from-green-500 to-emerald-600':t.type==='error'?'from-red-500 to-rose-600':'from-blue-500 to-cyan-600'} bg-gradient-to-r`}>
              <span>{t.type==='success'?'✓':t.type==='error'?'✕':'ℹ'}</span>
              <p className="flex-1 text-sm font-medium">{t.message}</p>
              <button onClick={()=>removeToast(t.id)} className="hover:opacity-80"><X className="w-4 h-4" /></button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() { const c = useContext(ToastContext); if (!c) throw new Error('useToast must be within ToastProvider'); return c; }
