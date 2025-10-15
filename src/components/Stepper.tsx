import React from 'react';

type Step = { id: number; label: string };

export default function Stepper({ steps, current }: { steps: Step[]; current: number }) {
  return (
    <ol className="flex items-center w-full" aria-label="Steps">
      {steps.map((step, idx) => {
        const isActive = step.id === current;
        const isDone = step.id < current;
        return (
          <React.Fragment key={step.id}>
            <li className="flex flex-col items-center flex-1 relative">
              <span
                className={[
                  'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold mb-1 z-10',
                  isDone ? 'bg-green-600 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700',
                ].join(' ')}
                aria-current={isActive ? 'step' : undefined}
              >
                {isDone ? '✓' : step.id}
              </span>
              <span className={`text-xs text-center px-1 leading-tight ${isActive ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                {step.label}
              </span>
            </li>
            {idx < steps.length - 1 && (
              <li className="flex-1 h-0.5 bg-gray-300 mx-2" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
}
