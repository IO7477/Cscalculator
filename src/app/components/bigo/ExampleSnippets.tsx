import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExampleSnippetsProps {
  onSelectExample: (code: string) => void;
}

const examples = [
  {
    name: 'Linear Search - O(n)',
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
  },
  {
    name: 'Binary Search - O(log n)',
    code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  
  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
  },
  {
    name: 'Bubble Sort - O(n²)',
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
  },
  {
    name: 'Merge Sort - O(n log n)',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return [...result, ...left, ...right];
}`,
  },
  {
    name: 'Fibonacci (Recursive) - O(2ⁿ)',
    code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
  },
  {
    name: 'Two Sum (Hash Map) - O(n)',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  {
    name: 'Array Access - O(1)',
    code: `function getElement(arr, index) {
  return arr[index];
}

function setElement(arr, index, value) {
  arr[index] = value;
}`,
  },
  {
    name: 'Matrix Multiplication - O(n³)',
    code: `function matrixMultiply(A, B) {
  const n = A.length;
  const result = Array(n).fill(0).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        result[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return result;
}`,
  },
  {
    name: 'Generate Permutations - O(n!)',
    code: `function permute(arr) {
  if (arr.length <= 1) return [arr];
  
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const perms = permute(rest);
    
    for (let perm of perms) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}`,
  },
];

export function ExampleSnippets({ onSelectExample }: ExampleSnippetsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="px-4 mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between transition-all hover:border-blue-300 dark:hover:border-blue-500"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white">
          📚 Load Example Code
        </span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 space-y-2">
          {examples.map((example) => (
            <button
              key={example.name}
              onClick={() => {
                onSelectExample(example.code);
                setIsExpanded(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {example.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
