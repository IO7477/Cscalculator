import { ComplexityClass } from '../components/bigo/ComplexityChips';

export interface AnalysisResult {
  complexity: ComplexityClass;
  confidence: 'high' | 'medium' | 'low';
  reasoning: string;
  patterns: string[];
  spaceComplexity?: string;
  bestCase?: string;
  averageCase?: string;
  worstCase?: string;
}

export function analyzeCode(code: string): AnalysisResult | null {
  if (!code.trim()) return null;

  const normalizedCode = code.toLowerCase();
  const lines = code.split('\n').filter(line => line.trim());
  
  const patterns: string[] = [];
  let complexity: ComplexityClass = 'O(1)';
  let reasoning = '';
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  let spaceComplexity = 'O(1)';
  let bestCase = '';
  let averageCase = '';
  let worstCase = '';

  // Count loop patterns
  const forLoopCount = countLoops(code, ['for', 'while', 'do']);
  const recursionCount = countRecursion(code);
  
  // Check for nested loops (most common performance pattern)
  const nestedLoopDepth = detectNestedLoops(code);
  
  // Check for divide and conquer patterns
  const hasDivideConquer = detectDivideAndConquer(normalizedCode);
  
  // Check for factorial/permutation patterns
  const hasFactorialPattern = detectFactorialPattern(normalizedCode);
  
  // Check for exponential patterns
  const hasExponentialPattern = detectExponentialPattern(normalizedCode);
  
  // Check for space complexity indicators
  const hasArrayCreation = /new\s+\w+\[|\.slice\(|\.concat\(|\.map\(/.test(code);
  const hasRecursiveSpace = recursionCount > 0;

  // Determine complexity based on patterns
  if (hasFactorialPattern) {
    complexity = 'O(n!)';
    reasoning = 'Detected factorial or permutation generation pattern. The algorithm uses a loop that iterates over n elements with a recursive call inside, generating all n! permutations. For each element, it recursively processes (n-1) elements, then (n-2), down to 1, resulting in n × (n-1) × (n-2) × ... × 1 = n! operations.';
    patterns.push('Loop with recursion inside (permutation pattern)');
    patterns.push('Generates all possible arrangements');
    patterns.push('Extremely expensive for n > 10');
    patterns.push('Example: n=10 → 3,628,800 operations');
    confidence = 'high';
    spaceComplexity = 'O(n!)';
    bestCase = 'O(n!)';
    averageCase = 'O(n!)';
    worstCase = 'O(n!)';
  } else if (hasExponentialPattern) {
    complexity = 'O(2ⁿ)';
    reasoning = 'Detected exponential growth pattern with multiple recursive branches. Common in naive recursive solutions like Fibonacci.';
    patterns.push('Multiple recursive calls per invocation');
    patterns.push('Creates binary tree of recursive calls');
    confidence = 'high';
    spaceComplexity = hasRecursiveSpace ? 'O(n)' : 'O(1)';
    bestCase = 'O(2ⁿ)';
    averageCase = 'O(2ⁿ)';
    worstCase = 'O(2ⁿ)';
  } else if (nestedLoopDepth >= 3) {
    complexity = 'O(n²)';
    reasoning = `Detected ${nestedLoopDepth} levels of nested loops. Triple-nested loops typically result in O(n³) but simplified to O(n²) for display.`;
    patterns.push(`${nestedLoopDepth} levels of nested iteration`);
    patterns.push('Each element compared with others');
    confidence = 'high';
    spaceComplexity = hasArrayCreation ? 'O(n)' : 'O(1)';
    bestCase = 'O(n²)';
    averageCase = 'O(n²)';
    worstCase = 'O(n²)';
  } else if (nestedLoopDepth === 2) {
    complexity = 'O(n²)';
    reasoning = 'Detected nested loops (loop within a loop). This quadratic pattern is common in comparison-based algorithms.';
    patterns.push('2 levels of nested loops');
    patterns.push('Quadratic growth - careful with large inputs');
    confidence = 'high';
    spaceComplexity = hasArrayCreation ? 'O(n)' : 'O(1)';
    bestCase = 'O(n)';
    averageCase = 'O(n²)';
    worstCase = 'O(n²)';
  } else if (hasDivideConquer && forLoopCount >= 1) {
    complexity = 'O(n log n)';
    reasoning = 'Detected divide-and-conquer with linear work per level. This pattern is typical of efficient sorting algorithms like merge sort and heap sort.';
    patterns.push('Divide and conquer strategy');
    patterns.push('Linear work per recursion level');
    patterns.push('log n levels of recursion');
    confidence = 'high';
    spaceComplexity = 'O(n)';
    bestCase = 'O(n log n)';
    averageCase = 'O(n log n)';
    worstCase = 'O(n log n)';
  } else if (hasDivideConquer || recursionCount > 0) {
    complexity = 'O(log n)';
    reasoning = 'Detected divide-and-conquer or binary search pattern. Input size is halved at each step, leading to logarithmic complexity.';
    patterns.push('Input size reduced by half each iteration');
    patterns.push('Logarithmic search space reduction');
    confidence = 'medium';
    spaceComplexity = hasRecursiveSpace ? 'O(log n)' : 'O(1)';
    bestCase = 'O(1)';
    averageCase = 'O(log n)';
    worstCase = 'O(log n)';
  } else if (forLoopCount >= 1) {
    complexity = 'O(n)';
    reasoning = 'Detected single loop iterating through input. Linear complexity means processing each element once.';
    patterns.push('Single pass through data');
    patterns.push('Scales linearly with input size');
    confidence = 'high';
    spaceComplexity = hasArrayCreation ? 'O(n)' : 'O(1)';
    bestCase = 'O(1)';
    averageCase = 'O(n)';
    worstCase = 'O(n)';
  } else {
    complexity = 'O(1)';
    reasoning = 'No loops or recursion detected. Operations appear to be constant time with direct access or fixed number of operations.';
    patterns.push('Fixed number of operations');
    patterns.push('Independent of input size');
    confidence = 'medium';
    spaceComplexity = 'O(1)';
    bestCase = 'O(1)';
    averageCase = 'O(1)';
    worstCase = 'O(1)';
  }

  return {
    complexity,
    confidence,
    reasoning,
    patterns,
    spaceComplexity,
    bestCase,
    averageCase,
    worstCase,
  };
}

function countLoops(code: string, keywords: string[]): number {
  let count = 0;
  const lines = code.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    for (const keyword of keywords) {
      // Match loop keywords at the start of statements
      if (trimmed.includes(`${keyword} `) || trimmed.includes(`${keyword}(`)) {
        count++;
      }
    }
  }
  
  return count;
}

function countRecursion(code: string): number {
  // Try to detect function name and count self-calls
  const functionNameMatch = code.match(/(?:function|def|void|int|public)\s+(\w+)/);
  if (!functionNameMatch) return 0;
  
  const functionName = functionNameMatch[1];
  const regex = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
  const matches = code.match(regex);
  
  // Subtract 1 for the declaration itself
  return matches ? Math.max(0, matches.length - 1) : 0;
}

function detectNestedLoops(code: string): number {
  const lines = code.split('\n');
  let maxDepth = 0;
  let currentDepth = 0;
  let braceDepth = 0;
  let loopBraceDepths: number[] = [];

  for (const line of lines) {
    const trimmed = line.trim().toLowerCase();
    
    // Count opening braces
    const openBraces = (line.match(/{/g) || []).length;
    const closeBraces = (line.match(/}/g) || []).length;
    
    // Check if this line starts a loop
    const isLoop = /\b(for|while|do)\b/.test(trimmed);
    
    if (isLoop) {
      loopBraceDepths.push(braceDepth);
      currentDepth++;
      maxDepth = Math.max(maxDepth, currentDepth);
    }
    
    braceDepth += openBraces;
    braceDepth -= closeBraces;
    
    // Remove loops that have closed
    loopBraceDepths = loopBraceDepths.filter(depth => depth < braceDepth);
    currentDepth = loopBraceDepths.length;
  }

  return maxDepth;
}

function detectDivideAndConquer(code: string): boolean {
  // Look for patterns like division, mid, binary search, etc.
  const patterns = [
    /\/\s*2/,  // division by 2
    /\bmid\b/,  // mid variable
    /\bhigh\b.*\blow\b/,  // high/low pointers
    /\bleft\b.*\bright\b/,  // left/right pointers
    /\.length\s*\/\s*2/,  // array.length / 2
  ];
  
  return patterns.some(pattern => pattern.test(code));
}

function detectFactorialPattern(code: string): boolean {
  // Look for factorial or permutation patterns
  
  // 1. Check for explicit keywords
  if (/factorial/i.test(code) || /permutation/i.test(code)) {
    return true;
  }
  
  // 2. Check for n * func(n-1) pattern
  if (/\bn\s*\*\s*\w+\(n\s*-\s*1\)/.test(code)) {
    return true;
  }
  
  // 3. Check for loop with recursion inside (permutation generation pattern)
  // This is the key pattern: for loop over array + recursive call = n! complexity
  const functionNameMatch = code.match(/(?:function|def|void|int|public)\s+(\w+)/);
  if (functionNameMatch) {
    const functionName = functionNameMatch[1];
    const lines = code.split('\n');
    
    let inLoop = false;
    let braceDepth = 0;
    let loopStartDepth = 0;
    
    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      
      // Track brace depth
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      
      // Check if we're entering a loop
      if (/\b(for|while)\b/.test(trimmed)) {
        inLoop = true;
        loopStartDepth = braceDepth;
      }
      
      braceDepth += openBraces;
      
      // Check for recursive call inside the loop
      if (inLoop && braceDepth > loopStartDepth) {
        const regex = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
        if (regex.test(line)) {
          // Found recursion inside a loop - likely O(n!)
          return true;
        }
      }
      
      braceDepth -= closeBraces;
      
      // Exit loop context when braces close
      if (inLoop && braceDepth <= loopStartDepth) {
        inLoop = false;
      }
    }
  }
  
  // 4. Check for backtracking with permutation patterns
  if (/backtrack/i.test(code) && /swap|permute|arrange/.test(code)) {
    return true;
  }
  
  // 5. Check for nested recursion that branches n ways (not just 2)
  // Pattern: loop that makes recursive calls for each element
  const hasLoopOverArray = /for\s*\([^)]*\.(length|size)|for\s*\([^)]*in\s/.test(code);
  const hasRecursion = functionNameMatch && new RegExp(`\\b${functionNameMatch[1]}\\s*\\(`).test(code);
  
  if (hasLoopOverArray && hasRecursion) {
    // Additional check: look for array manipulation (slice, splice, filter)
    // which is common in permutation generation
    const hasArrayManipulation = /\.(slice|splice|filter|concat)/.test(code);
    if (hasArrayManipulation) {
      return true;
    }
  }
  
  return false;
}

function detectExponentialPattern(code: string): boolean {
  // Try to detect multiple recursive calls (fibonacci pattern)
  const functionNameMatch = code.match(/(?:function|def|void|int|public)\s+(\w+)/);
  if (!functionNameMatch) return false;
  
  const functionName = functionNameMatch[1];
  const lines = code.split('\n');
  
  for (const line of lines) {
    // Look for lines with 2+ calls to the same function
    const regex = new RegExp(`\\b${functionName}\\s*\\(`, 'g');
    const matches = line.match(regex);
    if (matches && matches.length >= 2) {
      return true;
    }
  }
  
  return false;
}