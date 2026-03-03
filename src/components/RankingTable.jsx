import React, { useState } from 'react';
import { getRankColor, getPerformanceStatus, getNameBadgeColor } from '../utils/helpers';

const RankingTable = ({ candidates, onEditMark, onDeleteCandidate, onViewChart, isReadOnly = false }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingTestIndex, setEditingTestIndex] = useState(null);
  const [editObtained, setEditObtained] = useState('');
  const [editTotal, setEditTotal] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditClick = (candidateId, testIndex, test) => {
    setEditingId(candidateId);
    setEditingTestIndex(testIndex);
    // Support both old marks array (numbers) and new tests array (objects)
    if (typeof test === 'object' && test !== null) {
      setEditObtained(test.obtainedMarks);
      setEditTotal(test.totalMarks);
    } else {
      setEditObtained(test);
      setEditTotal(100);
    }
  };

  const handleSaveEdit = async (candidateId) => {
    const obtained = parseFloat(editObtained);
    const total = parseFloat(editTotal);
    if (!isNaN(obtained) && !isNaN(total) && obtained >= 0 && total > 0 && obtained <= total) {
      setIsSaving(true);
      try {
        await onEditMark(candidateId, editingTestIndex, obtained, total);
        setEditingId(null);
        setEditingTestIndex(null);
        setEditObtained('');
        setEditTotal('');
      } catch (error) {
        console.error('Error saving edit:', error);
        alert('Failed to save changes. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTestIndex(null);
    setEditObtained('');
    setEditTotal('');
  };

  if (candidates.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-12 text-center border border-purple-500/20">
        <div className="text-purple-400 text-4xl sm:text-6xl mb-4">📊</div>
        <h3 className="text-lg sm:text-xl font-semibold text-purple-300 mb-2">No Candidates Yet</h3>
        <p className="text-sm sm:text-base text-gray-400">
          {isReadOnly 
            ? 'No student data available to display.' 
            : 'Add your first candidate to start tracking performance!'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20">
      {/* Mobile Card View - Visible only on small screens */}
      <div className="md:hidden divide-y divide-gray-700/50">
        {candidates.map((candidate) => (
          <div
            key={candidate.id}
            className={`${getRankColor(candidate.rank)} p-4`}
          >
            {/* Rank and Name */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold">
                  #{candidate.rank}
                </span>
                {candidate.rank <= 3 && (
                  <span className="text-xl sm:text-2xl">
                    {candidate.rank === 1 ? '🥇' : candidate.rank === 2 ? '🥈' : '🥉'}
                  </span>
                )}
              </div>
              <div className="text-base sm:text-lg font-bold text-purple-300">
                {(candidate.finalPercentage || candidate.average).toFixed(2)}%
              </div>
            </div>

            {/* Name */}
            <div className="mb-2">
              <div className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r ${getNameBadgeColor(candidate.name).bg} ${getNameBadgeColor(candidate.name).text} font-semibold text-xs sm:text-sm shadow-md max-w-full`}>
                <span className="break-words">{candidate.name}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {(candidate.tests || candidate.marks).length} test{(candidate.tests || candidate.marks).length !== 1 ? 's' : ''} taken
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-2">
              <span className="inline-block px-2.5 py-1 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full shadow-md">
                {getPerformanceStatus(candidate)}
              </span>
            </div>

            {/* Test Details - Expandable */}
            {!isReadOnly && (
              <button
                onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                className="text-purple-400 hover:text-purple-300 text-xs font-medium underline mb-2"
              >
                {expandedId === candidate.id ? '▲ Hide Tests' : '▼ View/Edit Tests'}
              </button>
            )}

            {expandedId === candidate.id && (
              <div className="flex flex-wrap gap-2 mb-3 p-2 bg-gray-900/30 rounded-lg">
                {(candidate.tests || candidate.marks).map((item, index) => {
                  const isTestObject = typeof item === 'object' && item !== null;
                  const testNumber = isTestObject ? item.testNumber : index + 1;
                  const displayText = isTestObject 
                    ? `T${testNumber}: ${item.obtainedMarks}/${item.totalMarks} (${item.percentage.toFixed(1)}%)`
                    : `T${testNumber}: ${item}`;
                  
                  return (
                    <div key={index} className="inline-flex items-center">
                      {!isReadOnly && editingId === candidate.id && editingTestIndex === index ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={editObtained}
                            onChange={(e) => setEditObtained(e.target.value)}
                            className="w-14 px-1 py-1 bg-gray-900 border border-purple-500 rounded text-xs text-white"
                            min="0"
                            step="0.01"
                            autoFocus
                          />
                          <span className="text-purple-300 text-xs">/</span>
                          <input
                            type="number"
                            value={editTotal}
                            onChange={(e) => setEditTotal(e.target.value)}
                            className="w-14 px-1 py-1 bg-gray-900 border border-purple-500 rounded text-xs text-white"
                            min="1"
                            step="0.01"
                          />
                          <button
                            onClick={() => handleSaveEdit(candidate.id)}
                            className="text-emerald-400 hover:text-emerald-300 text-sm font-bold"
                          >
                            ✓
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-400 hover:text-red-300 text-sm font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={!isReadOnly ? () => handleEditClick(candidate.id, index, item) : undefined}
                          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                            isReadOnly 
                              ? 'bg-purple-900/40 text-purple-300 cursor-default'
                              : 'bg-purple-600/50 hover:bg-purple-600 text-white cursor-pointer'
                          }`}
                        >
                          {displayText}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => onViewChart(candidate)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg transition-all text-xs font-semibold shadow-lg"
              >
                📈 Chart
              </button>
              {!isReadOnly && onDeleteCandidate && (
                <button
                  onClick={async () => {
                    if (window.confirm(`Delete ${candidate.name}?`)) {
                      setIsDeleting(true);
                      try {
                        await onDeleteCandidate(candidate.id);
                      } catch (error) {
                        alert('Failed to delete. Try again.');
                      } finally {
                        setIsDeleting(false);
                      }
                    }
                  }}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600/80 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-all text-xs font-semibold shadow-lg disabled:opacity-50"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-purple-500/20">
          <thead className="bg-purple-900/40">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                Final %
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {candidates.map((candidate) => (
              <tr
                key={candidate.id}
                className={`${getRankColor(candidate.rank)} transition-colors hover:opacity-80`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold">
                      #{candidate.rank}
                    </span>
                    {candidate.rank <= 3 && (
                      <span className="ml-2 text-2xl">
                        {candidate.rank === 1 ? '🥇' : candidate.rank === 2 ? '🥈' : '🥉'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r ${getNameBadgeColor(candidate.name).bg} ${getNameBadgeColor(candidate.name).text} font-semibold text-sm lg:text-base shadow-md max-w-xs`}>
                    <span className="break-words">{candidate.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {(candidate.tests || candidate.marks).length} test{(candidate.tests || candidate.marks).length !== 1 ? 's' : ''} taken
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 bg-linear-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full shadow-md">
                        {getPerformanceStatus(candidate)}
                      </span>
                      {!isReadOnly && (
                        <button
                          onClick={() => setExpandedId(expandedId === candidate.id ? null : candidate.id)}
                          className="text-purple-400 hover:text-purple-300 text-xs font-medium underline"
                          title={expandedId === candidate.id ? "Hide test details" : "Show test details"}
                        >
                          {expandedId === candidate.id ? '▲ Hide' : '▼ Edit'}
                        </button>
                      )}
                    </div>
                    
                    {expandedId === candidate.id && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-500/30">
                        {(candidate.tests || candidate.marks).map((item, index) => {
                          const isTestObject = typeof item === 'object' && item !== null;
                          const testNumber = isTestObject ? item.testNumber : index + 1;
                          const displayText = isTestObject 
                            ? `T${testNumber}: ${item.obtainedMarks}/${item.totalMarks} (${item.percentage.toFixed(1)}%)`
                            : `T${testNumber}: ${item}`;
                          
                          return (
                            <div key={index} className="inline-flex items-center">
                              {!isReadOnly && editingId === candidate.id && editingTestIndex === index ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={editObtained}
                                    onChange={(e) => setEditObtained(e.target.value)}
                                    className="w-16 px-2 py-1 bg-gray-900 border border-purple-500 rounded-lg text-sm text-white"
                                    min="0"
                                    step="0.01"
                                    placeholder="Obtained"
                                    autoFocus
                                  />
                                  <span className="text-purple-300">/</span>
                                  <input
                                    type="number"
                                    value={editTotal}
                                    onChange={(e) => setEditTotal(e.target.value)}
                                    className="w-16 px-2 py-1 bg-gray-900 border border-purple-500 rounded-lg text-sm text-white"
                                    min="1"
                                    step="0.01"
                                    placeholder="Total"
                                  />
                                  <button
                                    onClick={() => handleSaveEdit(candidate.id)}
                                    className="text-emerald-400 hover:text-emerald-300 text-sm font-bold"
                                    title="Save"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="text-red-400 hover:text-red-300 text-sm font-bold"
                                    title="Cancel"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={!isReadOnly ? () => handleEditClick(candidate.id, index, item) : undefined}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                    isReadOnly 
                                      ? 'bg-purple-900/40 text-purple-300 cursor-default border border-purple-500/30'
                                      : 'bg-purple-600/50 hover:bg-purple-600 text-white cursor-pointer border border-purple-400/30'
                                  }`}
                                  title={isReadOnly ? 'View only' : 'Click to edit'}
                                >
                                  {displayText}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-base font-bold text-purple-300">
                    {(candidate.finalPercentage || candidate.average).toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onViewChart(candidate)}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg transition-all duration-300 shadow-md text-sm"
                      title="View Performance Chart"
                    >
                      📈 Chart
                    </button>
                    {!isReadOnly && onDeleteCandidate && (
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to delete${candidate.name}?`)) {
                            setIsDeleting(true);
                            try {
                              await onDeleteCandidate(candidate.id);
                            } catch (error) {
                              console.error('Error deleting candidate:', error);
                              alert('Failed to delete candidate. Please try again.');
                            } finally {
                              setIsDeleting(false);
                            }
                          }
                        }}
                        disabled={isDeleting}
                        className="bg-red-600/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all duration-300 shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Candidate"
                      >
                        {isDeleting ? '⏳ Deleting...' : '🗑️ Delete'}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RankingTable;
