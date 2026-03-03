import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-purple-300">
                Performance Chart - {candidate.name}
              </h2>
              <p className="text-gray-300 mt-2">
                Rank: <span className="font-semibold text-purple-400">#{candidate.rank}</span> | 
                Final %: <span className="font-semibold text-purple-400">{(candidate.finalPercentage || candidate.average).toFixed(2)}%</span> | 
                Tests: <span className="font-semibold text-purple-400">{testsData.length}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-3xl font-bold w-12 h-12 flex items-center justify-center rounded-xl hover:bg-gray-700 transition-all"
            >
              ×
            </button>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-4 border border-purple-500/20">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="test" 
                  label={{ value: 'Test Number', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  domain={[0, 100]}
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                />
                <Legend />
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

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-900/40 p-4 rounded-xl border border-purple-500/30">
              <h3 className="font-semibold text-purple-300 mb-3">Test Details:</h3>
              <div className="flex flex-wrap gap-2">
                {testsData.map((item, index) => {
                  if (isNewFormat) {
                    return (
                      <span 
                        key={index}
                        className="bg-purple-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-lg"
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
            
            <div className="bg-purple-900/40 p-4 rounded-xl border border-purple-500/30">
              <h3 className="font-semibold text-purple-300 mb-3">Statistics:</h3>
              <div className="space-y-2 text-sm text-gray-300">
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

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg"
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
