import { Copy } from 'lucide-react';

interface PostfixResultProps {
  postfix: string;
  prefix: string;
  tokenCount: number;
  onCopyPostfix: () => void;
  onCopyPrefix: () => void;
}

export function PostfixResult({ postfix, prefix, tokenCount, onCopyPostfix, onCopyPrefix }: PostfixResultProps) {
  return (
    <div className="px-4 mt-4 space-y-3">
      {/* Postfix Result */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-300">Postfix (RPN)</span>
          <button
            onClick={onCopyPostfix}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <Copy className="w-4 h-4 text-gray-500 dark:text-gray-300" />
          </button>
        </div>
        <div className="text-base font-mono text-gray-900 dark:text-white mb-2 break-words">
          {postfix || 'Type an infix expression above'}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-400">
          Tokens: {tokenCount}
        </div>
      </div>

      {/* Prefix Result */}
      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-indigo-600 dark:text-indigo-200">Prefix (Polish Notation)</span>
          <button
            onClick={onCopyPrefix}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors"
          >
            <Copy className="w-4 h-4 text-indigo-600 dark:text-indigo-200" />
          </button>
        </div>
        <div className="text-base font-mono text-gray-900 dark:text-white mb-2 break-words">
          {prefix || 'Type an infix expression above'}
        </div>
        <div className="text-xs text-indigo-500 dark:text-indigo-300">
          Tokens: {prefix ? prefix.split(/\s+/).filter(t => t).length : 0}
        </div>
      </div>
    </div>
  );
}
