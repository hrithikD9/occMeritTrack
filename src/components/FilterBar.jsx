import React from 'react';

const FilterBar = ({ testNumbers, selectedTest, onTestChange, onExport, onClearFilter, onRecalculateRanks, userRole }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-3 sm:p-4 mb-4 border border-purple-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <label className="text-xs sm:text-sm font-medium text-purple-200">
            Filter by Test:
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedTest || ''}
              onChange={(e) => onTestChange(e.target.value ? parseInt(e.target.value) : null)}
              className="flex-1 sm:flex-none px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white text-sm"
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
                className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors px-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Recalculate Ranks Button (Teacher only) */}
          {userRole === 'teacher' && (
            <button
              onClick={onRecalculateRanks}
              className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md text-sm"
              title="Recalculate all student ranks"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              <span className="hidden lg:inline">Recalculate</span>
            </button>
          )}

          {/* Export Button */}
          <button
            onClick={onExport}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md text-sm"
          >
            <svg 
              className="w-4 h-4" 
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
            <span className="hidden sm:inline">Export to CSV</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
