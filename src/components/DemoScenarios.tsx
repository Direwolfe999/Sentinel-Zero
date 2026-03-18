'use client';

import { motion } from 'framer-motion';
import { DEMO_SCENARIOS } from '@/utils/demoData';

interface DemoScenariosProps {
    onSelect: (text: string) => void;
}

export function DemoScenarios({ onSelect }: DemoScenariosProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
        >
            <p className="text-sm text-slate-400 mb-3">✨ Try a demo scenario:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DEMO_SCENARIOS.map((scenario, i) => (
                    <motion.button
                        key={scenario.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => onSelect(scenario.text)}
                        className="bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700 hover:border-blue-500/50 rounded-lg p-4 text-left transition duration-200 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="text-3xl mb-2">{scenario.icon}</div>
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition text-sm">
                            {scenario.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">{scenario.description}</p>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}

export default DemoScenarios;
