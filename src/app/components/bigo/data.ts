import type { ComplexityClass } from './ComplexityChips';

export interface ComplexityInfo {
  description: string;
  examples: string;
}

export const complexityData: Record<ComplexityClass, ComplexityInfo> = {
  'O(1)': {
    description: 'For input size n, runtime is constant regardless of n. Operations complete in fixed time.',
    examples: 'Typical examples: array access, hash table lookup, basic arithmetic.',
  },
  'O(log n)': {
    description: 'For input size n, runtime grows logarithmically. Doubling n adds only one more step.',
    examples: 'Typical examples: binary search, balanced tree operations.',
  },
  'O(n)': {
    description: 'For input size n, runtime grows linearly. Doubling n doubles the time.',
    examples: 'Typical examples: iterating through array, linear search, simple loops.',
  },
  'O(n log n)': {
    description: 'For input size n, runtime grows roughly n × log₂(n). Common in efficient sorting.',
    examples: 'Typical examples: merge sort, heap sort, quicksort (average case).',
  },
  'O(n²)': {
    description: 'For input size n, runtime grows quadratically. Doubling n quadruples the time.',
    examples: 'Typical examples: nested loops, bubble sort, selection sort, insertion sort.',
  },
  'O(2ⁿ)': {
    description: 'For input size n, runtime doubles with each additional element. Grows extremely fast.',
    examples: 'Typical examples: recursive fibonacci, generating power set, subset sum.',
  },
  'O(n!)': {
    description: 'For input size n, runtime grows factorially. One of the slowest growth rates.',
    examples: 'Typical examples: generating permutations, traveling salesman (brute force).',
  },
};
