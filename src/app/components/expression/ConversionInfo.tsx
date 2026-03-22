export function ConversionInfo() {
  return (
    <div className="px-4 mt-4">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3">
        <div className="flex items-start gap-2">
          <div className="text-blue-600 text-lg">⚡</div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-blue-900 mb-1">
              Real-time Conversion
            </h3>
            <p className="text-xs text-blue-700 leading-relaxed">
              As you type your infix expression above, both postfix and prefix notations are automatically generated below. Watch the conversion steps update in real-time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
