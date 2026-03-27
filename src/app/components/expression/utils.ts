// Operator precedence utilities
export const precedence = {
  isp: { '(': -1, '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 } as Record<string, number>,
  icp: { '(': -1, '+': 1, '-': 1, '*': 2, '/': 2, '^': 4 } as Record<string, number>,
};

export const isOperator = (token: string): boolean => {
  return ['+', '-', '*', '/', '^'].includes(token);
};

export const isOperand = (token: string): boolean => {
  return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
};

// Detect expression type
export const detectExpressionType = (expression: string): 'infix' | 'prefix' | 'postfix' | 'unknown' => {
  const tokens = expression.trim().split(/\s+/).filter(t => t);
  if (tokens.length === 0) return 'unknown';
  if (tokens.length === 1) return isOperand(tokens[0]) ? 'postfix' : 'unknown';

  let hasOperatorBeforeOperands = false;
  let hasOperandBeforeOperator = false;
  let hasOperatorAfterOperands = false;
  let hasParentheses = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '(' || token === ')') {
      hasParentheses = true;
      continue;
    }
  }

  // Check first token
  if (isOperator(tokens[0])) {
    hasOperatorBeforeOperands = true; // Likely prefix
  } else if (isOperand(tokens[0])) {
    hasOperandBeforeOperator = true;
  }

  // Check last token
  if (isOperator(tokens[tokens.length - 1])) {
    hasOperatorAfterOperands = true; // Likely postfix
  }

  // If has parentheses, it's likely infix
  if (hasParentheses) return 'infix';

  // If operator comes first and no parentheses → prefix
  if (hasOperatorBeforeOperands && !hasOperandBeforeOperator) return 'prefix';

  // If operator comes last → postfix
  if (hasOperatorAfterOperands) return 'postfix';

  // Default to infix (most common)
  return 'infix';
};
