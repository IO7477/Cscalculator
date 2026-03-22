import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface ValidationModeProps {
  mode: 'stack' | 'queue';
  actualTop?: string;
  actualFront?: string;
  actualRear?: string;
  actualSize: number;
}

export function ValidationMode({
  mode,
  actualTop,
  actualFront,
  actualRear,
  actualSize,
}: ValidationModeProps) {
  const [expectedValue, setExpectedValue] = useState('');
  const [expectedSize, setExpectedSize] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleValidate = () => {
    let correct = false;

    if (mode === 'stack') {
      correct = expectedValue === (actualTop || '') && 
                parseInt(expectedSize) === actualSize;
    } else {
      // For queue, check front value
      correct = expectedValue === (actualFront || '') && 
                parseInt(expectedSize) === actualSize;
    }

    setIsCorrect(correct);
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      if (correct) {
        setExpectedValue('');
        setExpectedSize('');
      }
    }, 3000);
  };

  return (
    <div className="px-4 mt-4">
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">🧪 Validation Mode</h3>
        <p className="text-xs text-gray-600 mb-3">
          Test your understanding! Predict the current state:
        </p>

        <div className="space-y-2 mb-3">
          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Expected {mode === 'stack' ? 'top' : 'front'} value:
            </label>
            <input
              type="text"
              value={expectedValue}
              onChange={(e) => setExpectedValue(e.target.value)}
              placeholder={mode === 'stack' ? 'e.g., 42' : 'e.g., A'}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">
              Expected size:
            </label>
            <input
              type="number"
              value={expectedSize}
              onChange={(e) => setExpectedSize(e.target.value)}
              placeholder="e.g., 3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <button
          onClick={handleValidate}
          disabled={!expectedValue || !expectedSize}
          className="w-full py-2 rounded-lg bg-yellow-500 text-white text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Validate My Answer
        </button>

        {showResult && (
          <div className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
            isCorrect
              ? 'bg-green-100 border border-green-300'
              : 'bg-red-100 border border-red-300'
          }`}>
            {isCorrect ? (
              <>
                <Check className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-green-800">Correct! 🎉</div>
                  <div className="text-xs text-green-700">Your mental model matches the structure!</div>
                </div>
              </>
            ) : (
              <>
                <X className="w-5 h-5 text-red-600" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-red-800">Not quite right</div>
                  <div className="text-xs text-red-700">
                    Actual {mode === 'stack' ? 'top' : 'front'}: {mode === 'stack' ? actualTop || 'empty' : actualFront || 'empty'}, Size: {actualSize}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
