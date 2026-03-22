import { Code, Zap, TrendingUp } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="px-4 mt-6">
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analyze Your Code
            </h3>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Paste your algorithm or code snippet above, and we'll automatically detect its time complexity
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <Code className="w-5 h-5 text-blue-600 mb-2" />
              <p className="text-xs font-medium text-gray-900">Multi-language</p>
              <p className="text-xs text-gray-500">JavaScript, Python, Java, C++</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-gray-200">
              <Zap className="w-5 h-5 text-purple-600 mb-2" />
              <p className="text-xs font-medium text-gray-900">Instant Analysis</p>
              <p className="text-xs text-gray-500">Real-time complexity detection</p>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <code className="px-3 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200">
                for (i = 0; i &lt; n; i++)
              </code>
              <code className="px-3 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200">
                nested loops
              </code>
              <code className="px-3 py-1 bg-white rounded-lg text-xs text-gray-700 border border-gray-200">
                binary search
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
