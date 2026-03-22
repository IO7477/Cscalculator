import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export function FormalDefinition() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Formal Mathematical Definition
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 p-4 space-y-4">
          {/* Big O Definition */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Big O Notation (Upper Bound)</h4>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                f(n) = <strong>O(g(n))</strong> means there exist constants c &gt; 0 and n₀ such that:
              </p>
              <code className="block text-center text-sm font-mono text-blue-900 dark:text-blue-300 bg-white dark:bg-[#131820] px-3 py-2 rounded-lg">
                0 ≤ f(n) ≤ c · g(n) for all n ≥ n₀
              </code>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                <strong>Meaning:</strong> g(n) is an asymptotic upper bound for f(n)
              </p>
            </div>
          </div>

          {/* Big Omega Definition */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Big Ω Notation (Lower Bound)</h4>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                f(n) = <strong>Ω(g(n))</strong> means there exist constants c &gt; 0 and n₀ such that:
              </p>
              <code className="block text-center text-sm font-mono text-green-900 dark:text-green-300 bg-white dark:bg-[#131820] px-3 py-2 rounded-lg">
                0 ≤ c · g(n) ≤ f(n) for all n ≥ n₀
              </code>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                <strong>Meaning:</strong> g(n) is an asymptotic lower bound for f(n)
              </p>
            </div>
          </div>

          {/* Big Theta Definition */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Big Θ Notation (Tight Bound)</h4>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                f(n) = <strong>Θ(g(n))</strong> means f(n) = O(g(n)) and f(n) = Ω(g(n))
              </p>
              <code className="block text-center text-sm font-mono text-purple-900 dark:text-purple-300 bg-white dark:bg-[#131820] px-3 py-2 rounded-lg">
                c₁ · g(n) ≤ f(n) ≤ c₂ · g(n) for all n ≥ n₀
              </code>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                <strong>Meaning:</strong> g(n) is an asymptotically tight bound for f(n)
              </p>
            </div>
          </div>

          {/* Key Properties */}
          <div className="bg-gray-50 dark:bg-[#131820] rounded-xl p-3 mt-4">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">📌 Key Properties</h4>
            <ul className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <li>• <strong>Drop constants:</strong> O(2n) = O(n)</li>
              <li>• <strong>Drop lower terms:</strong> O(n² + n) = O(n²)</li>
              <li>• <strong>Different inputs:</strong> O(a + b) for two arrays</li>
              <li>• <strong>Multiplication:</strong> Nested operations multiply complexities</li>
              <li>• <strong>Addition:</strong> Sequential operations add complexities</li>
            </ul>
          </div>

          {/* Common Rules */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 border border-purple-200 dark:border-purple-800">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">⚡ Analysis Rules</h4>
            <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
              <p>1. <strong>Focus on worst case</strong> unless specified</p>
              <p>2. <strong>Ignore constants</strong> - O(5n) becomes O(n)</p>
              <p>3. <strong>Consider input size</strong> - what happens as n → ∞?</p>
              <p>4. <strong>Different terms for inputs</strong> - O(a·b) not O(n²)</p>
              <p>5. <strong>Amortized analysis</strong> - average over sequence of operations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}