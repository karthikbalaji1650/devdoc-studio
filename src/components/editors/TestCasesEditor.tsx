import React from 'react';
import type { TestCaseItem } from '../../types/document';
import { Plus, Trash2 } from 'lucide-react';

interface TestCasesEditorProps {
  testCases?: TestCaseItem[];
  onChange: (testCases: TestCaseItem[]) => void;
}

export const TestCasesEditor: React.FC<TestCasesEditorProps> = ({
  testCases = [],
  onChange
}) => {
  const addTestCase = () => {
    const newId = `TC-${String(testCases.length + 1).padStart(2, '0')}`;
    const newTC: TestCaseItem = {
      id: newId,
      title: 'New Verification Test Case',
      objective: 'Verify expected operation under test conditions.',
      steps: ['Step 1: Navigate to component', 'Step 2: Trigger action'],
      expectedResult: 'Operation completes successfully.',
      status: 'PENDING'
    };
    onChange([...testCases, newTC]);
  };

  const updateTestCase = (index: number, updates: Partial<TestCaseItem>) => {
    const updated = testCases.map((tc, i) => (i === index ? { ...tc, ...updates } : tc));
    onChange(updated);
  };

  const removeTestCase = (index: number) => {
    onChange(testCases.filter((_, i) => i !== index));
  };

  const updateStep = (tcIndex: number, stepIndex: number, text: string) => {
    const tc = testCases[tcIndex];
    const newSteps = [...tc.steps];
    newSteps[stepIndex] = text;
    updateTestCase(tcIndex, { steps: newSteps });
  };

  const addStep = (tcIndex: number) => {
    const tc = testCases[tcIndex];
    const newSteps = [...tc.steps, `Step ${tc.steps.length + 1}: `];
    updateTestCase(tcIndex, { steps: newSteps });
  };

  const removeStep = (tcIndex: number, stepIndex: number) => {
    const tc = testCases[tcIndex];
    const newSteps = tc.steps.filter((_, i) => i !== stepIndex);
    updateTestCase(tcIndex, { steps: newSteps });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-slate-300">
          Test Cases ({testCases.length})
        </h4>
        <button
          type="button"
          onClick={addTestCase}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Test Case</span>
        </button>
      </div>

      <div className="space-y-3">
        {testCases.map((tc, tcIdx) => (
          <div
            key={tcIdx}
            className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3"
          >
            {/* Header: ID, Title, Status, Delete */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                <input
                  type="text"
                  value={tc.id}
                  onChange={(e) => updateTestCase(tcIdx, { id: e.target.value })}
                  placeholder="TC-01"
                  className="w-20 bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs font-bold text-blue-400 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  value={tc.title}
                  onChange={(e) => updateTestCase(tcIdx, { title: e.target.value })}
                  placeholder="Test Case Title..."
                  className="flex-1 bg-slate-950 border border-slate-700/80 rounded px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Status Picker */}
                <select
                  value={tc.status}
                  onChange={(e) => updateTestCase(tcIdx, { status: e.target.value as any })}
                  className={`text-xs font-bold px-2 py-1 rounded border focus:outline-none ${
                    tc.status === 'PASSED'
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                      : tc.status === 'FAILED'
                      ? 'bg-rose-950 text-rose-400 border-rose-800'
                      : tc.status === 'BLOCKED'
                      ? 'bg-purple-950 text-purple-400 border-purple-800'
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}
                >
                  <option value="PASSED">PASSED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="PENDING">PENDING</option>
                </select>

                <button
                  type="button"
                  onClick={() => removeTestCase(tcIdx)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Objective */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Objective</label>
              <input
                type="text"
                value={tc.objective}
                onChange={(e) => updateTestCase(tcIdx, { objective: e.target.value })}
                placeholder="What is being validated?"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Steps */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Execution Steps</span>
                <button
                  type="button"
                  onClick={() => addStep(tcIdx)}
                  className="text-blue-400 hover:text-blue-300 text-[10px] font-medium"
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-1">
                {tc.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono w-4 text-right">
                      {sIdx + 1}.
                    </span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateStep(tcIdx, sIdx, e.target.value)}
                      placeholder="Step instruction..."
                      className="flex-1 bg-slate-950 border border-slate-700/80 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    {tc.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(tcIdx, sIdx)}
                        className="text-slate-600 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Expected & Actual Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Expected Result</label>
                <textarea
                  value={tc.expectedResult}
                  onChange={(e) => updateTestCase(tcIdx, { expectedResult: e.target.value })}
                  placeholder="Expected behavior..."
                  rows={2}
                  className="w-full p-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Actual Result / Notes</label>
                <textarea
                  value={tc.actualResult || ''}
                  onChange={(e) => updateTestCase(tcIdx, { actualResult: e.target.value })}
                  placeholder="Actual outcome observed during test execution..."
                  rows={2}
                  className="w-full p-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
