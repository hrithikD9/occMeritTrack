import React, { useState, useEffect } from 'react';
import AddCandidate from './components/AddCandidate';
import RankingTable from './components/RankingTable';
import PerformanceChart from './components/PerformanceChart';
import FilterBar from './components/FilterBar';
import RoleSelectionModal from './components/RoleSelectionModal';
import { rankCandidates, exportToCSV } from './utils/helpers';
import { CONFIG } from './config';
import { authAPI, studentAPI } from './api/api';

const ROLE_STORAGE_KEY = CONFIG.ROLE_STORAGE_KEY;

function App() {
  const [candidates, setCandidates] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load candidates from backend API
  const loadCandidates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const students = await studentAPI.getAllStudents();
      
      // Transform backend data to frontend format
      const transformedData = students.map(student => ({
        id: student._id,
        name: student.name,
        tests: student.tests || [],
        marks: student.tests ? student.tests.map(t => t.obtainedMarks) : [],
        finalPercentage: student.finalPercentage,
        rank: student.rank
      }));
      
      setCandidates(transformedData);
    } catch (error) {
      console.error('Error loading candidates:', error);
      setError('Failed to load students. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load candidates on mount
  useEffect(() => {
    loadCandidates();
  }, []);

  // Load role from LocalStorage on mount and verify token
  useEffect(() => {
    const storedRole = localStorage.getItem(ROLE_STORAGE_KEY);
    const token = localStorage.getItem('token');
    
    if (storedRole) {
      // If teacher role, verify the token is valid
      if (storedRole === 'teacher') {
        if (token) {
          // Verify token validity
          authAPI.verifyToken()
            .then(() => {
              setUserRole(storedRole);
            })
            .catch((error) => {
              console.error('Token verification failed:', error);
              // Clear invalid session
              authAPI.logout();
              localStorage.removeItem(ROLE_STORAGE_KEY);
              setUserRole(null);
            });
        } else {
          // Teacher role but no token - clear the session
          console.warn('Teacher role found but no token present');
          localStorage.removeItem(ROLE_STORAGE_KEY);
          setUserRole(null);
        }
      } else {
        // Student role doesn't need token verification
        setUserRole(storedRole);
      }
    }
  }, []);

  // Add or update candidate - Now uses backend API
  const handleAddCandidate = async (name, obtainedMarks, totalMarks, testNumber) => {
    try {
      setError(null);
      
      // Check if user has valid authentication
      const token = localStorage.getItem('token');
      if (!token && userRole === 'teacher') {
        setError('Authentication required. Please log in again.');
        handleLogout();
        return { success: false, error: 'Authentication required. Please log in again.' };
      }
      
      // Send to backend
      const studentData = {
        name: name.trim(),
        testNumber: testNumber || 1,
        obtainedMarks,
        totalMarks
      };
      
      await studentAPI.addStudent(studentData);
      
      // Reload all candidates to get updated ranks
      await loadCandidates();
      
      return { success: true };
    } catch (error) {
      console.error('Error adding candidate:', error);
      
      // Check if it's an authentication error
      if (error.message.includes('Not authorized') || error.message.includes('token')) {
        setError('Your session has expired. Please log in again.');
        handleLogout();
        return { success: false, error: 'Session expired. Please log in again.' };
      }
      
      setError(error.message || 'Failed to add student');
      return { success: false, error: error.message };
    }
  };

  // Edit individual test mark
  const handleEditMark = async (candidateId, testIndex, newObtainedMarks, newTotalMarks) => {
    try {
      setError(null);
      
      await studentAPI.updateStudentMark(candidateId, testIndex, newObtainedMarks, newTotalMarks);
      
      // Reload all candidates to get updated ranks and percentages
      await loadCandidates();
      
      return { success: true };
    } catch (error) {
      console.error('Error updating mark:', error);
      setError(error.message || 'Failed to update marks');
      return { success: false, error: error.message };
    }
  };

  // Delete candidate
  const handleDeleteCandidate = async (candidateId) => {
    try {
      setError(null);
      
      await studentAPI.deleteStudent(candidateId);
      
      // Reload all candidates to get updated ranks
      await loadCandidates();
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting candidate:', error);
      setError(error.message || 'Failed to delete student');
      return { success: false, error: error.message };
    }
  };

  // Handle role selection
  const handleRoleSelect = async (role, passkey = '') => {
    try {
      setError(null);
      
      // Call backend login API
      await authAPI.login(role, passkey);
      
      setUserRole(role);
      localStorage.setItem(ROLE_STORAGE_KEY, role);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Authentication failed');
      return { success: false, error: error.message };
    }
  };

  // Handle logout
  const handleLogout = () => {
    authAPI.logout();
    setUserRole(null);
    localStorage.removeItem(ROLE_STORAGE_KEY);
  };

  // Handle viewing chart
  const handleViewChart = (candidate) => {
    setSelectedCandidate(candidate);
  };

  // Export to CSV
  const handleExport = () => {
    if (candidates.length === 0) {
      alert('No data to export!');
      return;
    }
    exportToCSV(candidates);
  };

  // Manually recalculate all ranks (Teacher only)
  const handleRecalculateRanks = async () => {
    if (userRole !== 'teacher') {
      alert('Only teachers can recalculate ranks!');
      return;
    }

    try {
      setLoading(true);
      const recalculatedStudents = await studentAPI.recalculateRanks();
      setCandidates(recalculatedStudents);
      alert('✅ Ranks recalculated successfully!');
    } catch (error) {
      console.error('Recalculate ranks error:', error);
      alert(`❌ Error recalculating ranks: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered and ranked candidates
  const getDisplayCandidates = () => {
    let filtered = [...candidates];

    // Apply test filter if selected
    if (selectedTest) {
      filtered = filtered
        .map((candidate) => {
          const tests = candidate.tests || [];
          const specificTest = tests.find(t => t.testNumber === selectedTest);
          
          // Only include candidates who have taken this specific test
          if (specificTest) {
            return {
              ...candidate,
              tests: [specificTest],
              marks: [specificTest.obtainedMarks]
            };
          }
          return null;
        })
        .filter(c => c !== null);
    }

    // Rank candidates
    return rankCandidates(filtered);
  };

  // Get all available test numbers across all candidates
  const getAllTestNumbers = () => {
    const testNumbersSet = new Set();
    candidates.forEach((candidate) => {
      const tests = candidate.tests || [];
      tests.forEach((test) => {
        if (test.testNumber) {
          testNumbersSet.add(test.testNumber);
        }
      });
    });
    return Array.from(testNumbersSet).sort((a, b) => a - b);
  };

  // Handle viewing test results (filter by test number)
  const handleViewTestResults = (testNum) => {
    setSelectedTest(testNum);
  };

  const displayCandidates = getDisplayCandidates();
  const testNumbers = getAllTestNumbers();

  // Show role selection modal if no role is set
  if (!userRole) {
    return <RoleSelectionModal onRoleSelect={handleRoleSelect} />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-purple-200 text-xl">Loading students data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 sm:mb-6">
            <div className="hidden sm:block sm:flex-1"></div>
            <div className="flex-1 flex justify-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-400">
                🎓 OCC MeritTrack
              </h1>
            </div>
            <div className="flex sm:flex-1 justify-center sm:justify-end gap-2 sm:gap-3">
              <div className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm ${
                userRole === 'teacher' 
                  ? 'bg-purple-600/90 text-white border border-purple-400/30' 
                  : 'bg-emerald-600/90 text-white border border-emerald-400/30'
              }`}>
                <span className="hidden sm:inline">{userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}</span>
                <span className="sm:hidden">{userRole === 'teacher' ? '👨‍🏫' : '👨‍🎓'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-5 py-2 sm:py-2.5 bg-red-600/90 hover:bg-red-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 shadow-lg backdrop-blur-sm border border-red-400/30"
                title="Logout"
              >
                <span className="hidden sm:inline">🚪 Logout</span>
                <span className="sm:hidden">🚪</span>
              </button>
            </div>
          </div>
          <p className="text-purple-200 text-sm sm:text-base lg:text-lg font-medium px-2">
            HSC Candidate Performance Evaluation System
          </p>
          <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-8 text-xs sm:text-sm">
            <span className="text-gray-300">📊 Total Candidates: <strong className="text-purple-400">{candidates.length}</strong></span>
            <span className="text-gray-300">📝 Total Tests: <strong className="text-purple-400">{testNumbers.length}</strong></span>
          </div>
        </header>

        {/* Student Mode Notice */}
        {userRole === 'student' && (
          <div className="mb-4 sm:mb-6 bg-purple-900/40 border-l-4 border-purple-400 p-3 sm:p-5 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-xl">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <span className="text-2xl sm:text-3xl">👁️</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-purple-200">
                  <strong className="text-purple-300">Read-Only Mode:</strong> You're viewing as a student. You can view rankings, charts, and export data, but cannot add, edit, or delete marks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-900/40 border-l-4 border-red-400 p-3 sm:p-5 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-xl">
            <div className="flex items-start gap-3">
              <div className="shrink-0">
                <span className="text-2xl sm:text-3xl">⚠️</span>
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-medium text-red-200">
                  <strong className="text-red-300">Error:</strong> {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-200 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={`grid grid-cols-1 ${
          userRole === 'teacher' ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
        } gap-6`}>
          {/* Left Column - Add Candidate Form (Teacher Only) */}
          {userRole === 'teacher' && (
            <div className="lg:col-span-1">
              <AddCandidate 
                onAddCandidate={handleAddCandidate} 
                existingCandidates={candidates}
              />
            </div>
          )}

          {/* Right Column - Rankings and Filters */}
          <div className={userRole === 'teacher' ? 'lg:col-span-2 space-y-6' : 'space-y-6'}>
            {/* Filter Bar */}
            {candidates.length > 0 && (
              <FilterBar
                testNumbers={testNumbers}
                selectedTest={selectedTest}
                onTestChange={setSelectedTest}
                onExport={handleExport}
                onClearFilter={() => setSelectedTest(null)}
                onRecalculateRanks={handleRecalculateRanks}
                userRole={userRole}
              />
            )}

            {/* Ranking Table */}
            <RankingTable
              candidates={displayCandidates}
              onEditMark={userRole === 'teacher' ? handleEditMark : null}
              onDeleteCandidate={userRole === 'teacher' ? handleDeleteCandidate : null}
              onViewChart={handleViewChart}
              isReadOnly={userRole === 'student'}
            />
          </div>
        </div>

        {/* Performance Chart Modal */}
        {selectedCandidate && (
          <PerformanceChart
            candidate={selectedCandidate}
            onClose={() => setSelectedCandidate(null)}
          />
        )}

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center text-gray-400 text-xs sm:text-sm px-2">
          <p className="text-purple-300 font-medium italic">
            "There are 10 types of people in the world: those who understand binary and those who don't."
          </p>
          <p className="mt-2 text-xs text-gray-500">
            💡 "Programs must be written for people to read, and only incidentally for machines to execute." - Harold Abelson
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
