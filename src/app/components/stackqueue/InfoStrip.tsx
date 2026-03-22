interface InfoStripProps {
  mode: 'stack' | 'queue';
}

export function InfoStrip({ mode }: InfoStripProps) {
  const content =
    mode === 'stack'
      ? 'LIFO: Last In, First Out. Top is where push/pop occur. Common uses: undo stack, function call stack, expression evaluation.'
      : 'FIFO: First In, First Out. Enqueue at rear, dequeue at front. Common uses: task scheduling, BFS, printer queue.';

  return (
    <div className="px-4 mt-4">
      <div className="bg-white border border-gray-200 rounded-2xl p-3">
        <p className="text-xs text-gray-700 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
