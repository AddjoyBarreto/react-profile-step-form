import React from 'react';

type Step = { id: number; label: string };

export default function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className="flex items-center gap-3" aria-label="Steps">
      {steps.map((step, idx) => {
        const isActive = step.id === current;
        const isDone = step.id < current;
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={[
                'inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold',
                isDone ? 'bg-green-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
              ].join(' ')}
              aria-current={isActive ? 'step' : undefined}
            >
              {isDone ? '✓' : step.id}
            </span>
            <span className={`text-sm ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>{step.label}</span>
            {idx < steps.length - 1 && (
              <span className="w-10 h-0.5 bg-gray-300 mx-2" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
