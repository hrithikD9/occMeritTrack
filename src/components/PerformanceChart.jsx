import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getNameBadgeColor } from '../utils/helpers';

const PerformanceChart = ({ candidate, onClose }) => {
  if (!candidate) return null;

  // Prepare data for the chart
  const testsData = candidate.tests || candidate.marks;
  const isNewFormat = candidate.tests && candidate.tests.length > 0 && typeof candidate.tests[0] === 'object';
  
  const chartData = testsData.map((item, index) => {
    if (isNewFormat) {
      return {
        test: `Test ${item.testNumber}`,
        percentage: item.percentage,
        finalPercentage: parseFloat(candidate.finalPercentage || candidate.average)
      };
    } else {
      return {
        test: `Test ${index + 1}`,
        percentage: item,
        finalPercentage: parseFloat(candidate.average)
      };
    }
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-purple-500/30">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300">
                  Performance Chart
                </h2>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r ${getNameBadgeColor(candidate.name).bg} ${getNameBadgeColor(candidate.name).text} font-semibold text-sm sm:text-base lg:text-lg shadow-md mb-2`}>
                <span className="text-base sm:text-lg lg:text-xl">{getNameBadgeColor(candidate.name).icon}</span>
                <span className="break-words">{candidate.name}</span>
              </div>
              <p className="text-gray-300 mt-1 sm:mt-2 text-xs sm:text-sm">
                Rank: <span className="font-semibold text-purple-400">#{candidate.rank}</span> | 
                Final %: <span className="font-semibold text-purple-400">{(candidate.finalPercentage || candidate.average).toFixed(2)}%</span> | 
                Tests: <span className="font-semibold text-purple-400">{testsData.length}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl sm:text-2xl font-bold w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 transition-all self-end sm:self-auto"
            >
              ×
            </button>
          </div>

          <div className="bg-gray-900/50 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-purple-500/20">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="test" 
                  label={{ value: 'Test Number', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#a78bfa" 
                  strokeWidth={3}
                  name="Test %"
                  dot={{ fill: '#a78bfa', r: 6 }}
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="finalPercentage" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Final %"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-purple-900/40 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-500/30">
              <h3 className="font-semibold text-purple-300 mb-2 sm:mb-3 text-sm sm:text-base">Test Details:</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {testsData.map((item, index) => {
                  if (isNewFormat) {
                    return (
                      <span 
                        key={index}
                        className="bg-purple-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium shadow-lg"
                      >
                        Test {item.testNumber}: {item.obtainedMarks}/{item.totalMarks} ({item.percentage.toFixed(1)}%)
                      </span>
                    );
                  } else {
                    return (
                      <span 
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg"
                      >
                        Test {index + 1}: {item}
                      </span>
                    );
                  }
                })}
              </div>
            </div>
            
            <div className="bg-purple-900/40 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-purple-500/30">
              <h3 className="font-semibold text-purple-300 mb-2 sm:mb-3 text-sm sm:text-base">Statistics:</h3>
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                {isNewFormat ? (
                  <>
                    <p>Highest %: <span className="font-semibold text-purple-400">{Math.max(...testsData.map(t => t.percentage)).toFixed(2)}%</span></p>
                    <p>Lowest %: <span className="font-semibold text-purple-400">{Math.min(...testsData.map(t => t.percentage)).toFixed(2)}%</span></p>
                    <p>Total Tests: <span className="font-semibold text-purple-400">{testsData.length}</span></p>
                  </>
                ) : (
                  <>
                    <p>Highest: <span className="font-semibold text-purple-400">{Math.max(...testsData)}</span></p>
                    <p>Lowest: <span className="font-semibold text-purple-400">{Math.min(...testsData)}</span></p>
                    <p>Total Tests: <span className="font-semibold text-purple-400">{testsData.length}</span></p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;
