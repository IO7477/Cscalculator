import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Operation {
  name: string;
  average: string;
  worst: string;
}

interface DataStructure {
  name: string;
  operations: Operation[];
}

const dataStructures: DataStructure[] = [
  {
    name: 'Array',
    operations: [
      { name: 'Access', average: 'O(1)', worst: 'O(1)' },
      { name: 'Search', average: 'O(n)', worst: 'O(n)' },
      { name: 'Insertion', average: 'O(n)', worst: 'O(n)' },
      { name: 'Deletion', average: 'O(n)', worst: 'O(n)' },
    ],
  },
  {
    name: 'Hash Table',
    operations: [
      { name: 'Search', average: 'O(1)', worst: 'O(n)' },
      { name: 'Insertion', average: 'O(1)', worst: 'O(n)' },
      { name: 'Deletion', average: 'O(1)', worst: 'O(n)' },
    ],
  },
  {
    name: 'Binary Search Tree',
    operations: [
      { name: 'Search', average: 'O(log n)', worst: 'O(n)' },
      { name: 'Insertion', average: 'O(log n)', worst: 'O(n)' },
      { name: 'Deletion', average: 'O(log n)', worst: 'O(n)' },
    ],
  },
  {
    name: 'Balanced BST (AVL/Red-Black)',
    operations: [
      { name: 'Search', average: 'O(log n)', worst: 'O(log n)' },
      { name: 'Insertion', average: 'O(log n)', worst: 'O(log n)' },
      { name: 'Deletion', average: 'O(log n)', worst: 'O(log n)' },
    ],
  },
];

const sortingAlgorithms = [
  { name: 'Quick Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
  { name: 'Merge Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
  { name: 'Heap Sort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)' },
  { name: 'Bubble Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  { name: 'Insertion Sort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
  { name: 'Selection Sort', best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
];

export function DataStructureReference() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'structures' | 'sorting'>('structures');

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full rounded-xl bg-purple-600 dark:bg-purple-600 p-4 flex items-center justify-between transition-all hover:shadow-lg hover:bg-purple-700 dark:hover:bg-purple-700"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-white" />
          <span className="text-sm font-semibold text-white">
            Big O Cheat Sheet
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-white" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 rounded-xl bg-white dark:bg-[#1a1f2e] border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('structures')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'structures'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Data Structures
            </button>
            <button
              onClick={() => setActiveTab('sorting')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'sorting'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sorting Algorithms
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {activeTab === 'structures' ? (
              <div className="space-y-4">
                {dataStructures.map((ds) => (
                  <div key={ds.name} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 dark:bg-[#131820] px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h4 className="text-xs font-semibold text-gray-900 dark:text-white">{ds.name}</h4>
                    </div>
                    <div className="p-2">
                      {ds.operations.map((op) => (
                        <div key={op.name} className="flex items-center justify-between py-2 px-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400">{op.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <div className="text-xs text-gray-500 dark:text-gray-500">Avg</div>
                              <code className="text-xs font-semibold text-blue-600 dark:text-blue-400">{op.average}</code>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500 dark:text-gray-500">Worst</div>
                              <code className="text-xs font-semibold text-orange-600 dark:text-orange-400">{op.worst}</code>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-2 px-2 font-semibold text-gray-900 dark:text-white">Algorithm</th>
                      <th className="text-center py-2 px-1 font-semibold text-gray-900 dark:text-white">Best</th>
                      <th className="text-center py-2 px-1 font-semibold text-gray-900 dark:text-white">Average</th>
                      <th className="text-center py-2 px-1 font-semibold text-gray-900 dark:text-white">Worst</th>
                      <th className="text-center py-2 px-1 font-semibold text-gray-900 dark:text-white">Space</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortingAlgorithms.map((algo) => (
                      <tr key={algo.name} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-2 px-2 text-gray-700 dark:text-gray-300">{algo.name}</td>
                        <td className="py-2 px-1 text-center">
                          <code className="text-green-600 dark:text-green-400 font-semibold">{algo.best}</code>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <code className="text-blue-600 dark:text-blue-400 font-semibold">{algo.average}</code>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <code className="text-orange-600 dark:text-orange-400 font-semibold">{algo.worst}</code>
                        </td>
                        <td className="py-2 px-1 text-center">
                          <code className="text-purple-600 dark:text-purple-400 font-semibold">{algo.space}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}