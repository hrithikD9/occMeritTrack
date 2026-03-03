import React from 'react';

const FilterBar = ({ testNumbers, selectedTest, onTestChange, onExport, onClearFilter }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-5 mb-6 border border-purple-500/20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-purple-200">
            Filter by Test:
          </label>
          <select
            value={selectedTest || ''}
            onChange={(e) => onTestChange(e.target.value ? parseInt(e.target.value) : null)}
            className="px-4 py-2.5 bg-gray-900/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white"
          >
            <option value="">All Tests</option>
            {testNumbers.map((testNum) => (
              <option key={testNum} value={testNum}>
                Test {testNum}
              </option>
            ))}
          </select>
          
          {selectedTest && (
            <button
              onClick={onClearFilter}
              className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>

        <button
          onClick={onExport}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
