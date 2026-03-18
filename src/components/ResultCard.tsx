'use client';

import { motion } from 'framer-motion';
import { Copy, Download, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '@/types';
import { useState } from 'react';

interface ResultCardProps {
  result: AnalysisResult;
  onNewAnalysis?: () => void;
}

export function ResultCard({ result, onNewAnalysis }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return 'from-red-500 to-red-600';
      case 'MEDIUM':
        return 'from-yellow-500 to-yellow-600';
      case 'LOW':
        return 'from-green-500 to-green-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'HIGH':
        return <AlertTriangle className="w-6 h-6" />;
      case 'MEDIUM':
        return <AlertCircle className="w-6 h-6" />;
      case 'LOW':
        return <CheckCircle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const handleCopy = async () => {
    const text = `Risk: ${result.risk}\nScore: ${result.riskScore}/100\nInsight: ${result.insight}\nRecommendation: ${result.recommendation}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-zero-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Risk Assessment Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white">Risk Assessment</h3>
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-sm font-semibold bg-slate-700 text-slate-200 px-3 py-1 rounded-full"
          >
            Confidence: {(result.confidence * 100).toFixed(0)}%
          </motion.span>
        </div>

        {/* Risk Badge - Animated */}
        <motion.div
          className={`inline-flex items-center gap-3 bg-gradient-to-r ${getRiskColor(
            result.risk
          )} text-white px-5 py-3 rounded-lg font-bold text-lg mb-5`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {getRiskIcon(result.risk)}
          {result.risk}
        </motion.div>

        {/* Risk Score Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300 font-medium">Risk Score</span>
            <span className="font-bold text-white">{result.riskScore}/100</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden border border-slate-600">
            <motion.div
              className={`h-full bg-gradient-to-r ${getRiskColor(result.risk)}`}
              initial={{ width: 0 }}
              animate={{ width: `${result.riskScore}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Insight Section */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 rounded-xl p-5 border border-slate-700"
      >
        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
          💡 Key Insight
        </h4>
        <p className="text-slate-200 leading-relaxed">{result.insight}</p>
      </motion.div>

      {/* Why Risky Section */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800 rounded-xl p-5 border border-slate-700"
      >
        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
          ⚠️ Why This Matters
        </h4>
        <p className="text-slate-200 leading-relaxed">{result.whyRisky}</p>
      </motion.div>

      {/* Patterns Detected - Pills */}
      {result.patternsDetected && result.patternsDetected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-xl p-5 border border-slate-700"
        >
          <h4 className="font-bold text-white mb-3 flex items-center gap-2">
            🔍 Patterns Detected
          </h4>
          <div className="flex flex-wrap gap-2">
            {result.patternsDetected.map((pattern, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 px-4 py-2 rounded-full text-sm font-medium border border-slate-500"
              >
                {pattern}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendation - Highlighted */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-2 border-blue-500/40 rounded-xl p-5"
      >
        <h4 className="font-bold text-blue-300 mb-3 flex items-center gap-2">
          🎯 Recommendation
        </h4>
        <p className="text-slate-100 leading-relaxed mb-5">{result.recommendation}</p>

        {/* Do's and Don'ts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-green-500/30">
            <h5 className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2">
              ✅ Do's
            </h5>
            <ul className="space-y-2">
              {result.actionItems.do.map((item, i) => (
                <li
                  key={i}
                  className="text-slate-300 text-sm flex items-start gap-2"
                >
                  <span className="text-green-400 font-bold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/30">
            <h5 className="text-red-400 font-bold text-sm mb-3 flex items-center gap-2">
              ❌ Don'ts
            </h5>
            <ul className="space-y-2">
              {result.actionItems.dont.map((item, i) => (
                <li
                  key={i}
                  className="text-slate-300 text-sm flex items-start gap-2"
                >
                  <span className="text-red-400 font-bold mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition font-semibold"
        >
          <Copy className="w-4 h-4" />
          {copied ? 'Copied!' : 'Copy'}
        </motion.button>
        <motion.button
          onClick={handleDownload}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition font-semibold"
        >
          <Download className="w-4 h-4" />
          Download
        </motion.button>
      </div>

      {/* New Analysis Button */}
      {onNewAnalysis && (
        <motion.button
          onClick={onNewAnalysis}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-white py-3 px-4 rounded-lg transition font-semibold border border-slate-600"
        >
          ↺ New Analysis
        </motion.button>
      )}
    </motion.div>
  );
}

export default ResultCard;
