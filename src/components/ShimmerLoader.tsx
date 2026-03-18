'use client';

import { motion } from 'framer-motion';

export function ShimmerLoader() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
        >
            {/* Shimmer skeleton loaders */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    className="h-12 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 rounded-lg overflow-hidden relative"
                    animate={{
                        backgroundPosition: ['200% 0', '-200% 0'],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    style={{
                        backgroundSize: '200% 100%',
                    }}
                />
            ))}
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center text-slate-400 text-sm mt-4 font-medium"
            >
                🤖 Analyzing with AI intelligence...
            </motion.p>
        </motion.div>
    );
}

export default ShimmerLoader;
