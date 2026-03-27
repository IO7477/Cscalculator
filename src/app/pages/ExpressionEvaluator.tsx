import { useState, useEffect } from 'react';
import { ExpressionHeader } from '../components/expression/ExpressionHeader';
import { ModeSelector } from '../components/expression/ModeSelector';
import { InfixInput } from '../components/expression/InfixInput';
import { PostfixResult } from '../components/expression/PostfixResult';
import { ConversionSteps, ConversionStep } from '../components/expression/ConversionSteps';
import { PostfixInput } from '../components/expression/PostfixInput';
import { EvaluationResult } from '../components/expression/EvaluationResult';
import { EvaluationTrace, EvaluationStep } from '../components/expression/EvaluationTrace';
import { ExamplePresets } from '../components/expression/ExamplePresets';
import { ExpressionActions } from '../components/expression/ExpressionActions';
import { ConversionInfo } from '../components/expression/ConversionInfo';
import { precedence, isOperator, isOperand, detectExpressionType } from '../components/expression/utils';

export default function ExpressionEvaluator() {
  const [mode, setMode] = useState<'convert' | 'evaluate'>('convert');
  
  // Conversion state
  const [infixExpression, setInfixExpression] = useState('');
  const [postfixResult, setPostfixResult] = useState('');
  const [prefixResult, setPrefixResult] = useState('');
  const [conversionSteps, setConversionSteps] = useState<ConversionStep[]>([]);
  const [stepThrough, setStepThrough] = useState(false);
  
  // Evaluation state
  const [evaluationInput, setEvaluationInput] = useState('');
  const [detectedType, setDetectedType] = useState<'infix' | 'prefix' | 'postfix' | 'unknown'>('unknown');
  const [evaluationResult, setEvaluationResult] = useState<number | null>(null);
  const [evaluationSteps, setEvaluationSteps] = useState<EvaluationStep[]>([]);
  
  // Auto-convert on infix input change
  useEffect(() => {
    if (infixExpression.trim()) {
      const tokens = infixExpression.trim().split(/\s+/).filter(t => t);
      if (tokens.length === 0) return;

      // POSTFIX CONVERSION
      const stackPost: string[] = ['$'];
      const outputPost: string[] = [];
      const steps: ConversionStep[] = [];

      steps.push({
        token: 'Start',
        stack: '$',
        output: '',
      });

      for (const token of tokens) {
        if (isOperand(token)) {
          outputPost.push(token);
          steps.push({
            token,
            stack: stackPost.join(' '),
            output: outputPost.join(' '),
          });
        } else if (token === '(') {
          stackPost.push(token);
          steps.push({
            token,
            stack: stackPost.join(' '),
            output: outputPost.join(' '),
          });
        } else if (token === ')') {
          while (stackPost.length > 0 && stackPost[stackPost.length - 1] !== '(') {
            const op = stackPost.pop()!;
            if (op !== '$') outputPost.push(op);
          }
          stackPost.pop(); // Remove '('
          steps.push({
            token,
            stack: stackPost.join(' '),
            output: outputPost.join(' '),
          });
        } else if (isOperator(token)) {
          const icpCurrent = precedence.icp[token] || 0;
          
          while (
            stackPost.length > 0 &&
            stackPost[stackPost.length - 1] !== '$' &&
            precedence.isp[stackPost[stackPost.length - 1]] >= icpCurrent
          ) {
            const op = stackPost.pop()!;
            outputPost.push(op);
          }
          
          stackPost.push(token);
          steps.push({
            token,
            stack: stackPost.join(' '),
            output: outputPost.join(' '),
          });
        }
      }

      while (stackPost.length > 0 && stackPost[stackPost.length - 1] !== '$') {
        const op = stackPost.pop()!;
        outputPost.push(op);
        steps.push({
          token: 'End',
          stack: stackPost.join(' '),
          output: outputPost.join(' '),
        });
      }

      const postfix = outputPost.join(' ');
      setPostfixResult(postfix);
      setConversionSteps(steps);

      // PREFIX CONVERSION
      const reversedTokens = [...tokens].reverse().map(t => {
        if (t === '(') return ')';
        if (t === ')') return '(';
        return t;
      });

      const stackPre: string[] = ['$'];
      const outputPre: string[] = [];

      for (const token of reversedTokens) {
        if (isOperand(token)) {
          outputPre.push(token);
        } else if (token === '(') {
          stackPre.push(token);
        } else if (token === ')') {
          while (stackPre.length > 0 && stackPre[stackPre.length - 1] !== '(') {
            const op = stackPre.pop()!;
            if (op !== '$') outputPre.push(op);
          }
          stackPre.pop();
        } else if (isOperator(token)) {
          const icpCurrent = precedence.icp[token] || 0;
          
          while (
            stackPre.length > 0 &&
            stackPre[stackPre.length - 1] !== '$' &&
            precedence.isp[stackPre[stackPre.length - 1]] > icpCurrent
          ) {
            const op = stackPre.pop()!;
            outputPre.push(op);
          }
          
          stackPre.push(token);
        }
      }

      while (stackPre.length > 0 && stackPre[stackPre.length - 1] !== '$') {
        const op = stackPre.pop()!;
        outputPre.push(op);
      }

      const prefix = outputPre.reverse().join(' ');
      setPrefixResult(prefix);
    } else {
      setPostfixResult('');
      setPrefixResult('');
      setConversionSteps([]);
    }
  }, [infixExpression]);

  // Auto-detect type on evaluation input change
  useEffect(() => {
    if (evaluationInput.trim()) {
      const type = detectExpressionType(evaluationInput);
      setDetectedType(type);
    } else {
      setDetectedType('unknown');
      setEvaluationResult(null);
      setEvaluationSteps([]);
    }
  }, [evaluationInput]);

  // Evaluate based on detected type
  const evaluateExpression = () => {
    if (!evaluationInput.trim()) return;

    try {
      const type = detectExpressionType(evaluationInput);
      
      if (type === 'postfix') {
        evaluatePostfix(evaluationInput);
      } else if (type === 'prefix') {
        evaluatePrefix(evaluationInput);
      } else if (type === 'infix') {
        evaluateInfix(evaluationInput);
      } else {
        alert('Unable to detect expression type. Please check your input.');
      }
    } catch (error) {
      alert('Error evaluating expression: ' + (error as Error).message);
    }
  };

  // Evaluate postfix expression
  const evaluatePostfix = (expression: string) => {
    const tokens = expression.trim().split(/\s+/).filter(t => t);
    const stack: number[] = [];
    const steps: EvaluationStep[] = [];

    for (const token of tokens) {
      const stackBeforeStr = `[${stack.join(', ')}]`;
      
      if (isOperand(token)) {
        stack.push(parseFloat(token));
        steps.push({
          token,
          stackBefore: stackBeforeStr,
          stackAfter: `[${stack.join(', ')}]`,
          operation: `Push ${token}`,
        });
      } else if (isOperator(token)) {
        if (stack.length < 2) {
          throw new Error('Invalid postfix expression (not enough operands)');
        }
        
        const operand2 = stack.pop()!;
        const operand1 = stack.pop()!;
        const result = applyOperator(token, operand1, operand2);

        stack.push(result);
        steps.push({
          token,
          stackBefore: stackBeforeStr,
          stackAfter: `[${stack.join(', ')}]`,
          operation: `${operand1} ${token} ${operand2} = ${result}`,
        });
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid postfix expression (too many operands)');
    }

    setEvaluationResult(stack[0]);
    setEvaluationSteps(steps);
  };

  // Evaluate prefix expression
  const evaluatePrefix = (expression: string) => {
    const tokens = expression.trim().split(/\s+/).filter(t => t).reverse();
    const stack: number[] = [];
    const steps: EvaluationStep[] = [];

    for (const token of tokens) {
      const stackBeforeStr = `[${stack.join(', ')}]`;
      
      if (isOperand(token)) {
        stack.push(parseFloat(token));
        steps.push({
          token,
          stackBefore: stackBeforeStr,
          stackAfter: `[${stack.join(', ')}]`,
          operation: `Push ${token}`,
        });
      } else if (isOperator(token)) {
        if (stack.length < 2) {
          throw new Error('Invalid prefix expression (not enough operands)');
        }
        
        const operand1 = stack.pop()!;
        const operand2 = stack.pop()!;
        const result = applyOperator(token, operand1, operand2);

        stack.push(result);
        steps.push({
          token,
          stackBefore: stackBeforeStr,
          stackAfter: `[${stack.join(', ')}]`,
          operation: `${operand1} ${token} ${operand2} = ${result}`,
        });
      }
    }

    if (stack.length !== 1) {
      throw new Error('Invalid prefix expression');
    }

    setEvaluationResult(stack[0]);
    setEvaluationSteps(steps);
  };

  // Evaluate infix expression (convert to postfix first, then evaluate)
  const evaluateInfix = (expression: string) => {
    const tokens = expression.trim().split(/\s+/).filter(t => t);
    const stack: string[] = ['$'];
    const output: string[] = [];

    for (const token of tokens) {
      if (isOperand(token)) {
        output.push(token);
      } else if (token === '(') {
        stack.push(token);
      } else if (token === ')') {
        while (stack.length > 0 && stack[stack.length - 1] !== '(') {
          const op = stack.pop()!;
          if (op !== '$') output.push(op);
        }
        stack.pop();
      } else if (isOperator(token)) {
        const icpCurrent = precedence.icp[token] || 0;
        
        while (
          stack.length > 0 &&
          stack[stack.length - 1] !== '$' &&
          precedence.isp[stack[stack.length - 1]] >= icpCurrent
        ) {
          const op = stack.pop()!;
          output.push(op);
        }
        
        stack.push(token);
      }
    }

    while (stack.length > 0 && stack[stack.length - 1] !== '$') {
      const op = stack.pop()!;
      output.push(op);
    }

    const postfix = output.join(' ');
    evaluatePostfix(postfix);
  };

  const applyOperator = (operator: string, operand1: number, operand2: number): number => {
    switch (operator) {
      case '+': return operand1 + operand2;
      case '-': return operand1 - operand2;
      case '*': return operand1 * operand2;
      case '/': return operand1 / operand2;
      case '^': return Math.pow(operand1, operand2);
      default: throw new Error(`Unknown operator: ${operator}`);
    }
  };

  const handleCopyPostfix = () => {
    navigator.clipboard.writeText(postfixResult);
  };

  const handleCopyPrefix = () => {
    navigator.clipboard.writeText(prefixResult);
  };

  const handleCopyAllSteps = () => {
    let text = '';
    
    if (mode === 'convert' && conversionSteps.length > 0) {
      text = 'EXPRESSION CONVERSION\n';
      text += '='.repeat(60) + '\n\n';
      text += `Infix:   ${infixExpression}\n`;
      text += `Postfix: ${postfixResult}\n`;
      text += `Prefix:  ${prefixResult}\n\n`;
      text += 'CONVERSION STEPS (to Postfix):\n';
      text += '-'.repeat(60) + '\n';
      text += 'TOKEN | STACK | OUTPUT\n';
      text += '-'.repeat(60) + '\n';
      conversionSteps.forEach(step => {
        text += `${step.token.padEnd(6)} | ${step.stack.padEnd(20)} | ${step.output}\n`;
      });
    } else if (mode === 'evaluate' && evaluationSteps.length > 0) {
      text = 'EXPRESSION EVALUATION\n';
      text += '='.repeat(60) + '\n\n';
      text += `Expression: ${evaluationInput}\n`;
      text += `Type: ${detectedType}\n`;
      text += `Result: ${evaluationResult}\n\n`;
      text += 'EVALUATION STEPS:\n';
      text += '-'.repeat(60) + '\n';
      evaluationSteps.forEach(step => {
        text += `Token: ${step.token}\n`;
        text += `  Before: ${step.stackBefore}\n`;
        text += `  After:  ${step.stackAfter}\n`;
        text += `  ${step.operation}\n\n`;
      });
    }
    
    text += '\nGenerated by Dev Calculators - Expression Evaluator';
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setInfixExpression('');
    setPostfixResult('');
    setPrefixResult('');
    setConversionSteps([]);
    setEvaluationInput('');
    setEvaluationResult(null);
    setEvaluationSteps([]);
    setDetectedType('unknown');
  };

  const handleExample = (expression: string) => {
    setInfixExpression(expression);
    setMode('convert');
  };

  const handleModeChange = (newMode: 'convert' | 'evaluate') => {
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-24">
      <ExpressionHeader />
      
      <ModeSelector mode={mode} onChange={handleModeChange} />
      
      {mode === 'convert' ? (
        <>
          <InfixInput value={infixExpression} onChange={setInfixExpression} />
          
          <ConversionInfo />
          
          {(postfixResult || prefixResult) && (
            <>
              <PostfixResult
                postfix={postfixResult}
                prefix={prefixResult}
                tokenCount={postfixResult.split(/\s+/).filter(t => t).length}
                onCopyPostfix={handleCopyPostfix}
                onCopyPrefix={handleCopyPrefix}
              />
              
              <ConversionSteps
                steps={conversionSteps}
                stepThrough={stepThrough}
                onToggleStepThrough={() => setStepThrough(!stepThrough)}
              />
            </>
          )}
        </>
      ) : (
        <>
          <PostfixInput 
            value={evaluationInput} 
            onChange={setEvaluationInput}
            detectedType={detectedType}
          />
          
          <div className="px-4 mt-4 flex justify-center">
            <button
              onClick={evaluateExpression}
              disabled={!evaluationInput.trim()}
              className="px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Evaluate
            </button>
          </div>
          
          {evaluationResult !== null && (
            <>
              <EvaluationResult
                result={evaluationResult}
                hasTrace={evaluationSteps.length > 0}
              />
              
              <EvaluationTrace
                steps={evaluationSteps}
                result={evaluationResult}
              />
            </>
          )}
        </>
      )}
      
      <ExamplePresets onExample={handleExample} />
      
      <ExpressionActions onClear={handleClear} onCopySteps={handleCopyAllSteps} />
    </div>
  );
}