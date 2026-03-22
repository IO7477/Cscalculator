import { useState } from 'react';
import { StackQueueHeader } from '../components/stackqueue/StackQueueHeader';
import { StructureSelector } from '../components/stackqueue/StructureSelector';
import { VisualizationModeSelector } from '../components/stackqueue/VisualizationModeSelector';
import { CapacitySettings } from '../components/stackqueue/CapacitySettings';
import { QueueTypeSelector } from '../components/stackqueue/QueueTypeSelector';
import { ValueInput } from '../components/stackqueue/ValueInput';
import { OperationButtons2 } from '../components/stackqueue/OperationButtons2';
import { ArrayStackVisualization } from '../components/stackqueue/ArrayStackVisualization';
import { LinkedListStackVisualization } from '../components/stackqueue/LinkedListStackVisualization';
import { ArrayQueueVisualization } from '../components/stackqueue/ArrayQueueVisualization';
import { LinkedListQueueVisualization } from '../components/stackqueue/LinkedListQueueVisualization';
import { EnhancedOperationLog, EnhancedOperation } from '../components/stackqueue/EnhancedOperationLog';
import { InfoStrip } from '../components/stackqueue/InfoStrip';
import { ScenarioPresets } from '../components/stackqueue/ScenarioPresets';
import { MetricsPanel } from '../components/stackqueue/MetricsPanel';
import { ValidationMode } from '../components/stackqueue/ValidationMode';
import { StackQueueActions } from '../components/stackqueue/StackQueueActions';

export default function StackQueueCalculator2() {
  // Core state
  const [mode, setMode] = useState<'stack' | 'queue'>('stack');
  const [visualizationMode, setVisualizationMode] = useState<'array' | 'linkedlist'>('array');
  const [capacity, setCapacity] = useState(5);
  const [queueType, setQueueType] = useState<'linear' | 'circular'>('circular');
  
  // Stack state (array-based)
  const [stackArray, setStackArray] = useState<(string | null)[]>(Array(capacity).fill(null));
  const [topPointer, setTopPointer] = useState(-1);
  
  // Queue state (array-based)
  const [queueArray, setQueueArray] = useState<(string | null)[]>(Array(capacity).fill(null));
  const [frontPointer, setFrontPointer] = useState(-1);
  const [rearPointer, setRearPointer] = useState(-1);
  
  // Linked list representation
  const [linkedListItems, setLinkedListItems] = useState<string[]>([]);
  
  // UI state
  const [inputValue, setInputValue] = useState('');
  const [operations, setOperations] = useState<EnhancedOperation[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | undefined>();
  const [isStepMode, setIsStepMode] = useState(false);
  const [operationCount, setOperationCount] = useState(0);

  // Adjust capacity
  const handleCapacityChange = (newCapacity: number) => {
    setCapacity(newCapacity);
    if (visualizationMode === 'array') {
      // Reset arrays with new capacity
      const newStackArray = Array(newCapacity).fill(null);
      const newQueueArray = Array(newCapacity).fill(null);
      
      // Copy existing data if it fits
      for (let i = 0; i <= topPointer && i < newCapacity; i++) {
        newStackArray[i] = stackArray[i];
      }
      
      setStackArray(newStackArray);
      setQueueArray(newQueueArray);
      
      // Reset queue pointers (simpler)
      setFrontPointer(-1);
      setRearPointer(-1);
    }
  };

  // Stack operations
  const handlePush = () => {
    if (!inputValue.trim()) return;
    
    setOperationCount(prev => prev + 1);

    if (visualizationMode === 'linkedlist') {
      const newItems = [inputValue.trim(), ...linkedListItems];
      setLinkedListItems(newItems);
      setStatusMessage(`✅ Pushed ${inputValue.trim()} onto stack`);
      
      addOperation({
        type: 'push',
        value: inputValue.trim(),
        result: `[${newItems.join(', ')}]`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 2,
      });
    } else {
      if (topPointer >= capacity - 1) {
        setStatusMessage('❌ Stack overflow! Cannot push.');
        return;
      }
      
      const newTop = topPointer + 1;
      const newArray = [...stackArray];
      newArray[newTop] = inputValue.trim();
      setStackArray(newArray);
      setTopPointer(newTop);
      setStatusMessage(`✅ Pushed ${inputValue.trim()} at index ${newTop}`);
      
      addOperation({
        type: 'push',
        value: inputValue.trim(),
        result: `top = ${newTop}`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 3,
      });
    }
    
    setInputValue('');
    clearMessageAfterDelay();
  };

  const handlePop = () => {
    setOperationCount(prev => prev + 1);

    if (visualizationMode === 'linkedlist') {
      if (linkedListItems.length === 0) {
        setStatusMessage('❌ Stack underflow! Cannot pop.');
        return;
      }
      
      const poppedValue = linkedListItems[0];
      const newItems = linkedListItems.slice(1);
      setLinkedListItems(newItems);
      setStatusMessage(`✅ Popped ${poppedValue} from stack`);
      
      addOperation({
        type: 'pop',
        value: poppedValue,
        result: `[${newItems.join(', ')}]`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 2,
      });
    } else {
      if (topPointer < 0) {
        setStatusMessage('❌ Stack underflow! Cannot pop.');
        return;
      }
      
      const poppedValue = stackArray[topPointer];
      const newArray = [...stackArray];
      newArray[topPointer] = null;
      setStackArray(newArray);
      setTopPointer(topPointer - 1);
      setStatusMessage(`✅ Popped ${poppedValue} from index ${topPointer}`);
      
      addOperation({
        type: 'pop',
        value: poppedValue || '',
        result: `top = ${topPointer - 1}`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 2,
      });
    }
    
    clearMessageAfterDelay();
  };

  const handlePeek = () => {
    setOperationCount(prev => prev + 1);

    if (visualizationMode === 'linkedlist') {
      if (linkedListItems.length === 0) {
        setStatusMessage('⚠️ Stack is empty. Peek returns NULL.');
        return;
      }
      
      const topValue = linkedListItems[0];
      setStatusMessage(`👁️ Peek: top value is ${topValue}`);
      
      addOperation({
        type: 'peek',
        value: topValue,
        result: topValue,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 1,
      });
    } else {
      if (topPointer < 0) {
        setStatusMessage('⚠️ Stack is empty. Peek returns NULL.');
        return;
      }
      
      const topValue = stackArray[topPointer];
      setStatusMessage(`👁️ Peek: top value at [${topPointer}] is ${topValue}`);
      
      addOperation({
        type: 'peek',
        value: topValue || '',
        result: `arr[${topPointer}] = ${topValue}`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 1,
      });
    }
    
    clearMessageAfterDelay();
  };

  // Queue operations
  const handleEnqueue = () => {
    if (!inputValue.trim()) return;
    
    setOperationCount(prev => prev + 1);

    if (visualizationMode === 'linkedlist') {
      const newItems = [...linkedListItems, inputValue.trim()];
      setLinkedListItems(newItems);
      setStatusMessage(`✅ Enqueued ${inputValue.trim()} to queue`);
      
      addOperation({
        type: 'enqueue',
        value: inputValue.trim(),
        result: `[${newItems.join(', ')}]`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 2,
      });
    } else {
      // Check if queue is full
      if (queueType === 'circular') {
        if ((rearPointer + 1) % capacity === frontPointer && frontPointer !== -1) {
          setStatusMessage('❌ Queue overflow! Cannot enqueue.');
          return;
        }
      } else {
        if (rearPointer >= capacity - 1) {
          setStatusMessage('❌ Queue overflow! Cannot enqueue (linear).');
          return;
        }
      }
      
      const newArray = [...queueArray];
      let newRear = rearPointer;
      let newFront = frontPointer;
      
      if (frontPointer === -1) {
        // First element
        newFront = 0;
        newRear = 0;
      } else {
        newRear = queueType === 'circular' ? (rearPointer + 1) % capacity : rearPointer + 1;
      }
      
      newArray[newRear] = inputValue.trim();
      setQueueArray(newArray);
      setFrontPointer(newFront);
      setRearPointer(newRear);
      setStatusMessage(`✅ Enqueued ${inputValue.trim()} at index ${newRear}`);
      
      addOperation({
        type: 'enqueue',
        value: inputValue.trim(),
        result: `front=${newFront}, rear=${newRear}`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: queueType === 'circular' ? 4 : 3,
      });
    }
    
    setInputValue('');
    clearMessageAfterDelay();
  };

  const handleDequeue = () => {
    setOperationCount(prev => prev + 1);

    if (visualizationMode === 'linkedlist') {
      if (linkedListItems.length === 0) {
        setStatusMessage('❌ Queue underflow! Cannot dequeue.');
        return;
      }
      
      const dequeuedValue = linkedListItems[0];
      const newItems = linkedListItems.slice(1);
      setLinkedListItems(newItems);
      setStatusMessage(`✅ Dequeued ${dequeuedValue} from queue`);
      
      addOperation({
        type: 'dequeue',
        value: dequeuedValue,
        result: `[${newItems.join(', ')}]`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: 2,
      });
    } else {
      if (frontPointer === -1) {
        setStatusMessage('❌ Queue underflow! Cannot dequeue.');
        return;
      }
      
      const dequeuedValue = queueArray[frontPointer];
      const newArray = [...queueArray];
      newArray[frontPointer] = null;
      
      let newFront = frontPointer;
      let newRear = rearPointer;
      
      if (frontPointer === rearPointer) {
        // Last element
        newFront = -1;
        newRear = -1;
      } else {
        newFront = queueType === 'circular' ? (frontPointer + 1) % capacity : frontPointer + 1;
      }
      
      setQueueArray(newArray);
      setFrontPointer(newFront);
      setRearPointer(newRear);
      setStatusMessage(`✅ Dequeued ${dequeuedValue} from index ${frontPointer}`);
      
      addOperation({
        type: 'dequeue',
        value: dequeuedValue || '',
        result: `front=${newFront}, rear=${newRear}`,
        timestamp: Date.now(),
        complexity: 'O(1)',
        steps: queueType === 'circular' ? 4 : 3,
      });
    }
    
    clearMessageAfterDelay();
  };

  const handleFrontPeek = () => {
    setOperationCount(prev => prev + 1);

    const frontValue = visualizationMode === 'linkedlist' 
      ? linkedListItems[0] 
      : queueArray[frontPointer];
      
    if (!frontValue) {
      setStatusMessage('⚠️ Queue is empty. Front peek returns NULL.');
      return;
    }
    
    setStatusMessage(`👁️ Front: ${frontValue}`);
    addOperation({
      type: 'front',
      value: frontValue,
      result: frontValue,
      timestamp: Date.now(),
      complexity: 'O(1)',
      steps: 1,
    });
    
    clearMessageAfterDelay();
  };

  const handleRearPeek = () => {
    setOperationCount(prev => prev + 1);

    const rearValue = visualizationMode === 'linkedlist' 
      ? linkedListItems[linkedListItems.length - 1] 
      : queueArray[rearPointer];
      
    if (!rearValue) {
      setStatusMessage('⚠️ Queue is empty. Rear peek returns NULL.');
      return;
    }
    
    setStatusMessage(`👁️ Rear: ${rearValue}`);
    addOperation({
      type: 'rear',
      value: rearValue,
      result: rearValue,
      timestamp: Date.now(),
      complexity: 'O(1)',
      steps: 1,
    });
    
    clearMessageAfterDelay();
  };

  const addOperation = (op: EnhancedOperation) => {
    setOperations(prev => [...prev, op]);
  };

  const clearMessageAfterDelay = () => {
    setTimeout(() => setStatusMessage(undefined), 3000);
  };

  const handleScenario = (scenario: string) => {
    switch (scenario) {
      case 'function-calls':
        // Simulate function call stack
        if (visualizationMode === 'linkedlist') {
          setLinkedListItems(['main()', 'foo()', 'bar()']);
        } else {
          const newArray = [...stackArray];
          newArray[0] = 'main()';
          newArray[1] = 'foo()';
          newArray[2] = 'bar()';
          setStackArray(newArray);
          setTopPointer(2);
        }
        setStatusMessage('📚 Loaded function call stack');
        break;
        
      case 'undo-stack':
        if (visualizationMode === 'linkedlist') {
          setLinkedListItems(['Edit 1', 'Edit 2', 'Edit 3']);
        } else {
          const newArray = [...stackArray];
          newArray[0] = 'Edit 1';
          newArray[1] = 'Edit 2';
          newArray[2] = 'Edit 3';
          setStackArray(newArray);
          setTopPointer(2);
        }
        setStatusMessage('↩️ Loaded undo stack');
        break;
        
      case 'producer-consumer':
        if (visualizationMode === 'linkedlist') {
          setLinkedListItems(['Task1', 'Task2', 'Task3']);
        } else {
          const newArray = Array(capacity).fill(null);
          newArray[0] = 'Task1';
          newArray[1] = 'Task2';
          newArray[2] = 'Task3';
          setQueueArray(newArray);
          setFrontPointer(0);
          setRearPointer(2);
        }
        setStatusMessage('🏭 Loaded producer-consumer queue');
        break;
        
      case 'task-scheduling':
        if (visualizationMode === 'linkedlist') {
          setLinkedListItems(['P1', 'P2', 'P3', 'P4']);
        } else {
          const newArray = Array(capacity).fill(null);
          newArray[0] = 'P1';
          newArray[1] = 'P2';
          newArray[2] = 'P3';
          newArray[3] = 'P4';
          setQueueArray(newArray);
          setFrontPointer(0);
          setRearPointer(3);
        }
        setStatusMessage('🎫 Loaded task scheduling queue');
        break;
        
      case 'reverse':
        if (mode === 'stack' && visualizationMode === 'linkedlist') {
          setLinkedListItems([...linkedListItems].reverse());
          setStatusMessage('🔄 Reversed stack');
        }
        break;
        
      case 'rotate':
        if (mode === 'queue' && visualizationMode === 'linkedlist' && linkedListItems.length > 0) {
          const rotated = [...linkedListItems.slice(1), linkedListItems[0]];
          setLinkedListItems(rotated);
          setStatusMessage('🔄 Rotated queue');
        }
        break;
        
      case 'clear':
        handleReset();
        break;
    }
    
    clearMessageAfterDelay();
  };

  const handleReset = () => {
    setStackArray(Array(capacity).fill(null));
    setQueueArray(Array(capacity).fill(null));
    setLinkedListItems([]);
    setTopPointer(-1);
    setFrontPointer(-1);
    setRearPointer(-1);
    setOperations([]);
    setInputValue('');
    setStatusMessage(undefined);
    setOperationCount(0);
  };

  const handleCopyState = () => {
    let state = '';
    
    if (mode === 'stack') {
      if (visualizationMode === 'array') {
        state = `STACK (Array Implementation)\n${'='.repeat(40)}\n`;
        state += `Capacity: ${capacity}\n`;
        state += `Top pointer: ${topPointer}\n`;
        state += `Size: ${topPointer + 1}\n`;
        state += `Array: [${stackArray.map(v => v || '_').join(', ')}]\n`;
        state += `isEmpty: ${topPointer < 0}\n`;
        state += `isFull: ${topPointer >= capacity - 1}\n`;
      } else {
        state = `STACK (Linked List Implementation)\n${'='.repeat(40)}\n`;
        state += `Size: ${linkedListItems.length}\n`;
        state += `Items (top → bottom): ${linkedListItems.join(' → ')}\n`;
      }
    } else {
      if (visualizationMode === 'array') {
        state = `QUEUE (${queueType} Array Implementation)\n${'='.repeat(40)}\n`;
        state += `Capacity: ${capacity}\n`;
        state += `Front pointer: ${frontPointer}\n`;
        state += `Rear pointer: ${rearPointer}\n`;
        state += `Array: [${queueArray.map(v => v || '_').join(', ')}]\n`;
        state += `isEmpty: ${frontPointer === -1}\n`;
      } else {
        state = `QUEUE (Linked List Implementation)\n${'='.repeat(40)}\n`;
        state += `Size: ${linkedListItems.length}\n`;
        state += `Items (front → rear): ${linkedListItems.join(' → ')}\n`;
      }
    }
    
    state += `\nGenerated by Dev Calculators - Stack & Queue`;
    navigator.clipboard.writeText(state);
    setStatusMessage('📋 Copied state to clipboard!');
    clearMessageAfterDelay();
  };

  const handleModeChange = (newMode: 'stack' | 'queue') => {
    setMode(newMode);
    handleReset();
  };

  const handleVisualizationModeChange = (newMode: 'array' | 'linkedlist') => {
    setVisualizationMode(newMode);
    // Sync linked list with array representation
    if (newMode === 'linkedlist') {
      if (mode === 'stack') {
        const items = stackArray.filter((v, i) => i <= topPointer && v !== null) as string[];
        setLinkedListItems(items.reverse());
      } else {
        const items: string[] = [];
        if (frontPointer !== -1) {
          if (queueType === 'circular') {
            let i = frontPointer;
            do {
              if (queueArray[i]) items.push(queueArray[i] as string);
              i = (i + 1) % capacity;
            } while (i !== (rearPointer + 1) % capacity);
          } else {
            for (let i = frontPointer; i <= rearPointer; i++) {
              if (queueArray[i]) items.push(queueArray[i] as string);
            }
          }
        }
        setLinkedListItems(items);
      }
    }
  };

  const currentSize = mode === 'stack' 
    ? (visualizationMode === 'array' ? topPointer + 1 : linkedListItems.length)
    : (visualizationMode === 'array' 
        ? (frontPointer === -1 ? 0 : (queueType === 'circular' 
            ? (rearPointer >= frontPointer ? rearPointer - frontPointer + 1 : capacity - frontPointer + rearPointer + 1)
            : (rearPointer - frontPointer + 1)))
        : linkedListItems.length);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1419] pb-24">
      <StackQueueHeader />
      
      <StructureSelector mode={mode} onChange={handleModeChange} />
      
      <VisualizationModeSelector mode={visualizationMode} onChange={handleVisualizationModeChange} />
      
      {visualizationMode === 'array' && (
        <CapacitySettings 
          capacity={capacity} 
          onChange={handleCapacityChange}
          currentSize={currentSize}
        />
      )}
      
      {mode === 'queue' && visualizationMode === 'array' && (
        <QueueTypeSelector queueType={queueType} onChange={setQueueType} />
      )}
      
      <ValueInput value={inputValue} onChange={setInputValue} />
      
      {mode === 'stack' ? (
        <OperationButtons2
          mode="stack"
          onPush={handlePush}
          onPop={handlePop}
          onPeek={handlePeek}
          isPushDisabled={!inputValue.trim() || (visualizationMode === 'array' && topPointer >= capacity - 1)}
          isPopDisabled={visualizationMode === 'array' ? topPointer < 0 : linkedListItems.length === 0}
          isPeekDisabled={visualizationMode === 'array' ? topPointer < 0 : linkedListItems.length === 0}
        />
      ) : (
        <OperationButtons2
          mode="queue"
          onEnqueue={handleEnqueue}
          onDequeue={handleDequeue}
          onFrontPeek={handleFrontPeek}
          onRearPeek={handleRearPeek}
          isEnqueueDisabled={!inputValue.trim() || (visualizationMode === 'array' && (
            queueType === 'circular' 
              ? ((rearPointer + 1) % capacity === frontPointer && frontPointer !== -1)
              : (rearPointer >= capacity - 1)
          ))}
          isDequeueDisabled={visualizationMode === 'array' ? frontPointer === -1 : linkedListItems.length === 0}
          isPeekDisabled={visualizationMode === 'array' ? frontPointer === -1 : linkedListItems.length === 0}
        />
      )}
      
      {mode === 'stack' && visualizationMode === 'array' && (
        <ArrayStackVisualization
          items={stackArray}
          capacity={capacity}
          topPointer={topPointer}
          statusMessage={statusMessage}
        />
      )}
      
      {mode === 'stack' && visualizationMode === 'linkedlist' && (
        <LinkedListStackVisualization
          items={linkedListItems}
          statusMessage={statusMessage}
        />
      )}
      
      {mode === 'queue' && visualizationMode === 'array' && (
        <ArrayQueueVisualization
          items={queueArray}
          capacity={capacity}
          frontPointer={frontPointer}
          rearPointer={rearPointer}
          queueType={queueType}
          statusMessage={statusMessage}
        />
      )}
      
      {mode === 'queue' && visualizationMode === 'linkedlist' && (
        <LinkedListQueueVisualization
          items={linkedListItems}
          statusMessage={statusMessage}
        />
      )}
      
      <MetricsPanel
        mode={mode}
        size={currentSize}
        capacity={capacity}
        operationCount={operationCount}
        visualizationMode={visualizationMode}
      />
      
      <EnhancedOperationLog operations={operations} />
      
      <ValidationMode
        mode={mode}
        actualTop={visualizationMode === 'array' ? (stackArray[topPointer] || undefined) : linkedListItems[0]}
        actualFront={visualizationMode === 'array' ? (queueArray[frontPointer] || undefined) : linkedListItems[0]}
        actualRear={visualizationMode === 'array' ? (queueArray[rearPointer] || undefined) : linkedListItems[linkedListItems.length - 1]}
        actualSize={currentSize}
      />
      
      <InfoStrip mode={mode} />
      
      <ScenarioPresets
        mode={mode}
        onScenario={handleScenario}
        isStepMode={isStepMode}
        onStepModeToggle={() => setIsStepMode(!isStepMode)}
      />
      
      <StackQueueActions onReset={handleReset} onCopy={handleCopyState} />
    </div>
  );
}