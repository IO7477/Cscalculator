export function ExplanationCard() {
  return (
    <div className="px-4 mt-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-3">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">How it works</h3>
        <p className="text-xs text-gray-700 mb-1.5">
          <span className="font-medium">1's Complement:</span> Flip all bits (0→1, 1→0)
        </p>
        <p className="text-xs text-gray-700 mb-3">
          <span className="font-medium">2's Complement:</span> 1's complement + 1
        </p>
        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-medium rounded-full border border-blue-200">
          CS fundamentals
        </span>
      </div>
    </div>
  );
}
