import React, { useState, useEffect, useRef } from 'react';
import { getNameBadgeColor } from '../utils/helpers';

const AddCandidate = ({ onAddCandidate, existingCandidates = [] }) => {
  const [name, setName] = useState('');
  const [testNumber, setTestNumber] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [obtainedMarks, setObtainedMarks] = useState('');
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize name for comparison (trim and lowercase)
  const normalizeName = (name) => name.trim().toLowerCase();

  // Check if exact match exists (case-insensitive)
  const findExactMatch = (inputName) => {
    const normalized = normalizeName(inputName);
    return existingCandidates.find(
      (candidate) => normalizeName(candidate.name) === normalized
    );
  };

  // Filter suggestions based on input
  useEffect(() => {
    if (name.trim().length > 0) {
      const normalizedInput = normalizeName(name);
      const matches = existingCandidates.filter((candidate) =>
        normalizeName(candidate.name).includes(normalizedInput)
      );
      
      setFilteredSuggestions(matches);
      
      // Check if there's an exact match
      const exactMatch = findExactMatch(name);
      setIsNewStudent(!exactMatch && name.trim().length > 0);
      
      // Show dropdown if there are matches or if it's a new student
      setShowDropdown(matches.length > 0 || (!exactMatch && name.trim().length > 0));
    } else {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      setIsNewStudent(false);
    }
  }, [name, existingCandidates]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle selecting a suggestion
  const handleSelectSuggestion = (candidateName) => {
    setName(candidateName);
    setShowDropdown(false);
    setIsNewStudent(false);
  };

  // Handle adding new student
  const handleAddNewStudent = () => {
    // Validation
    if (!testNumber || isNaN(testNumber) || parseInt(testNumber) <= 0) {
      setError('Please enter a valid test number (positive integer)');
      return;
    }
    
    if (!totalMarks || isNaN(totalMarks) || parseFloat(totalMarks) <= 0) {
      setError('Please enter valid total marks (positive number)');
      return;
    }
    
    if (!obtainedMarks || isNaN(obtainedMarks) || parseFloat(obtainedMarks) < 0) {
      setError('Please enter valid obtained marks (positive number or 0)');
      return;
    }
    
    if (parseFloat(obtainedMarks) > parseFloat(totalMarks)) {
      setError('Obtained marks cannot exceed total marks');
      return;
    }

    onAddCandidate(name.trim(), parseFloat(obtainedMarks), parseFloat(totalMarks), parseInt(testNumber));
    
    // Reset form
    setName('');
    setTestNumber('');
    setTotalMarks('');
    setObtainedMarks('');
    setError('');
    setShowDropdown(false);
    setIsNewStudent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      setError('Please enter candidate name');
      return;
    }
    
    if (!testNumber || isNaN(testNumber) || parseInt(testNumber) <= 0) {
      setError('Please enter a valid test number (positive integer)');
      return;
    }
    
    // Check if THIS SPECIFIC STUDENT already has this test number
    const currentStudent = findExactMatch(name);
    if (currentStudent) {
      const studentTests = currentStudent.tests || [];
      const hasTestNumber = studentTests.some(test => test.testNumber === parseInt(testNumber));
      
      if (hasTestNumber) {
        // This student already has this test number - show error
        setError(`${currentStudent.name} has already submitted Test ${testNumber}. Cannot add duplicate test.`);
        return;
      }
    }
    
    if (!totalMarks || isNaN(totalMarks) || parseFloat(totalMarks) <= 0) {
      setError('Please enter valid total marks (positive number)');
      return;
    }
    
    if (!obtainedMarks || isNaN(obtainedMarks) || parseFloat(obtainedMarks) < 0) {
      setError('Please enter valid obtained marks (positive number or 0)');
      return;
    }
    
    if (parseFloat(obtainedMarks) > parseFloat(totalMarks)) {
      setError('Obtained marks cannot exceed total marks');
      return;
    }
    
    // Add candidate with specified test number (now async)
    setIsSubmitting(true);
    setError('');
    
    try {
      const result = await onAddCandidate(
        name.trim(), 
        parseFloat(obtainedMarks), 
        parseFloat(totalMarks), 
        parseInt(testNumber)
      );
      
      if (result && result.success) {
        // Reset form on success
        setName('');
        setTestNumber('');
        setTotalMarks('');
        setObtainedMarks('');
        setError('');
        setShowDropdown(false);
        setIsNewStudent(false);
      } else if (result && !result.success) {
        setError(result.error || 'Failed to add test result');
      }
    } catch (err) {
      setError('Failed to add test result. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-purple-500/20">
      <h2 className="text-xl sm:text-2xl font-bold text-purple-300 mb-4 sm:mb-6">Add Test Result</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="relative">
          <label className="block text-xs sm:text-sm font-medium text-purple-200 mb-2">
            Candidate Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => name.trim().length > 0 && setShowDropdown(true)}
            placeholder="Start typing student name..."
            autoComplete="off"
            className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 text-sm"
          />
          
          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-2 bg-gray-800 border border-purple-500/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto"
            >
              {/* Existing student suggestions */}
              {filteredSuggestions.length > 0 && (
                <div>
                  <div className="px-4 py-2 bg-purple-900/40 text-xs font-semibold text-purple-300 uppercase border-b border-purple-500/30">
                    Existing Students
                  </div>
                  {filteredSuggestions.map((candidate) => (
                    <div
                      key={candidate.id}
                      onClick={() => handleSelectSuggestion(candidate.name)}
                      className="px-4 py-3 hover:bg-purple-900/40 cursor-pointer border-b border-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r ${getNameBadgeColor(candidate.name).bg} ${getNameBadgeColor(candidate.name).text} font-semibold text-xs sm:text-sm shadow-md mb-1 max-w-full`}>
                            <span className="text-sm sm:text-base flex-shrink-0">{getNameBadgeColor(candidate.name).icon}</span>
                            <span className="break-words truncate">{candidate.name}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {candidate.tests.length} test{candidate.tests.length !== 1 ? 's' : ''} • 
                            Final: {candidate.finalPercentage ? candidate.finalPercentage.toFixed(2) : '0.00'}%
                          </div>
                        </div>
                        <span className="text-purple-400 text-sm ml-2">Select</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add New Student Button */}
              {isNewStudent && filteredSuggestions.length === 0 && (
                <div className="p-4">
                  <button
                    type="button"
                    onClick={handleAddNewStudent}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md text-sm"
                  >
                    <span>➕</span>
                    <span>Add New Student: "{name.trim()}"</span>
                  </button>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    This will create a new student entry
                  </p>
                </div>
              )}
              
              {/* No results */}
              {!isNewStudent && filteredSuggestions.length === 0 && name.trim().length > 0 && (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No matching students found
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-purple-200 mb-2">
            Test Number
          </label>
          <input
            type="number"
            value={testNumber}
            onChange={(e) => setTestNumber(e.target.value)}
            placeholder="Enter test number (e.g., 1, 2, 3...)"
            min="1"
            step="1"
            className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 text-sm"
          />
          {testNumber && name.trim() && (() => {
            const currentStudent = findExactMatch(name);
            const testNum = parseInt(testNumber);
            
            if (currentStudent && testNum > 0) {
              const studentTests = currentStudent.tests || [];
              const hasTestNumber = studentTests.some(test => test.testNumber === testNum);
              
              if (hasTestNumber) {
                return (
                  <p className="mt-2 text-sm text-red-400 bg-red-900/30 border border-red-500/30 px-3 py-2 rounded-lg">
                    ❌ {currentStudent.name} already submitted Test {testNum}. Cannot add duplicate.
                  </p>
                );
              } else {
                return (
                  <p className="mt-2 text-sm text-green-400 bg-green-900/30 border border-green-500/30 px-3 py-2 rounded-lg">
                    ✅ Test {testNum} will be added to {currentStudent.name}'s record.
                  </p>
                );
              }
            } else if (!currentStudent && testNum > 0) {
              return (
                <p className="mt-2 text-sm text-blue-400 bg-blue-900/30 border border-blue-500/30 px-3 py-2 rounded-lg">
                  ℹ️ New student "{name.trim()}" will be created with Test {testNum}.
                </p>
              );
            }
            return null;
          })()}
        </div>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-purple-200 mb-2">
            Total Marks
          </label>
          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            placeholder="Enter total marks (e.g., 25, 50, 100)"
            min="1"
            step="0.01"
            className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-purple-200 mb-2">
            Obtained Marks
          </label>
          <input
            type="number"
            value={obtainedMarks}
            onChange={(e) => setObtainedMarks(e.target.value)}
            placeholder="Enter obtained marks"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-white placeholder-gray-400 text-sm"
          />
        </div>
        
        {totalMarks && obtainedMarks && !isNaN(totalMarks) && !isNaN(obtainedMarks) && parseFloat(totalMarks) > 0 && (
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-2">
            <p className="text-xs text-purple-200">
              📊 <strong className="text-purple-300">Percentage:</strong> {((parseFloat(obtainedMarks) / parseFloat(totalMarks)) * 100).toFixed(2)}%
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-3 py-2 rounded-lg backdrop-blur-sm text-xs">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isSubmitting 
            ? '⏳ Saving...' 
            : (findExactMatch(name) ? 'Add Test Mark to Existing Student' : 'Add Test Result')
          }
        </button>
      </form>
      
      <div className="mt-3 p-3 bg-purple-900/30 rounded-lg border border-purple-500/20">
        <p className="text-xs text-purple-200">
          💡 <strong className="text-purple-300">Tip:</strong> Each student can have their own Test 1, 2, 3, etc. Multiple students can submit results for the same test number. A student cannot submit the same test twice.
        </p>
      </div>
    </div>
  );
};

export default AddCandidate;
