import React, { useState } from 'react';

const RoleSelectionModal = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setError('');
    setPasskey('');
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await onRoleSelect('teacher', passkey);
      
      if (!result.success) {
        setError(result.error || 'Kireee Teacher button chap diso ken ?');
        setPasskey('');
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setPasskey('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentAccess = async () => {
    setIsLoading(true);
    try {
      await onRoleSelect('student', '');
    } catch (err) {
      setError('Failed to access student mode.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedRole(null);
    setPasskey('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-linear-to-br from-gray-900 via-purple-900/50 to-gray-900 flex items-center justify-center z-50 p-3 sm:p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl sm:text-6xl opacity-10 animate-pulse">🎓</div>
        <div className="absolute top-20 right-20 text-3xl sm:text-5xl opacity-10 animate-bounce">📚</div>
        <div className="absolute bottom-20 left-20 text-3xl sm:text-5xl opacity-10 animate-pulse delay-100">💯</div>
        <div className="absolute bottom-10 right-10 text-4xl sm:text-6xl opacity-10 animate-bounce delay-200">🏆</div>
        <div className="absolute top-1/2 left-1/4 text-3xl sm:text-4xl opacity-10 animate-pulse delay-300">✨</div>
        <div className="absolute top-1/3 right-1/3 text-3xl sm:text-4xl opacity-10 animate-bounce delay-400">📊</div>
      </div>

      <div className="bg-gray-800/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border-2 border-purple-500/40 relative z-10 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-pink-600 p-6 sm:p-8 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            🎓 OCC MeritTrack
          </h2>
          <p className="text-center mt-2 sm:mt-3 text-purple-100 text-base sm:text-lg">
            Welcome! Please select your role
          </p>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8">
          {!selectedRole ? (
            // Role Selection View
            <div className="space-y-4 sm:space-y-6">
              <p className="text-center text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
                Are you a Teacher or a Student?
              </p>

              {/* Teacher Card */}
              <div
                onClick={() => handleRoleClick('teacher')}
                className="group cursor-pointer border-2 border-purple-500/30 bg-gray-900/50 rounded-xl p-5 sm:p-8 hover:border-purple-500 hover:bg-purple-900/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-5xl sm:text-7xl">👨‍🏫</div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-purple-300 group-hover:text-purple-200">
                      Teacher
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
                      Full access with passkey
                    </p>
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <span className="bg-green-900/50 text-green-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-500/30">Add</span>
                      <span className="bg-blue-900/50 text-blue-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-blue-500/30">Edit</span>
                      <span className="bg-red-900/50 text-red-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-red-500/30">Delete</span>
                      <span className="bg-purple-900/50 text-purple-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-purple-500/30">Export</span>
                    </div>
                  </div>
                  <div className="text-gray-500 group-hover:text-purple-400 text-xl sm:text-2xl">
                    →
                  </div>
                </div>
              </div>

              {/* Student Card */}
              <div
                onClick={() => handleRoleClick('student')}
                className="group cursor-pointer border-2 border-purple-500/30 bg-gray-900/50 rounded-xl p-5 sm:p-8 hover:border-emerald-500 hover:bg-emerald-900/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-5xl sm:text-7xl">👨‍🎓</div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-emerald-300 group-hover:text-emerald-200">
                      Student
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 mt-1 sm:mt-2">
                      Read-only access
                    </p>
                    <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <span className="bg-blue-900/50 text-blue-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-blue-500/30">View Rankings</span>
                      <span className="bg-purple-900/50 text-purple-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-purple-500/30">View Charts</span>
                      <span className="bg-green-900/50 text-green-300 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-green-500/30">Export CSV</span>
                    </div>
                  </div>
                  <div className="text-gray-500 group-hover:text-emerald-400 text-xl sm:text-2xl">
                    →
                  </div>
                </div>
              </div>
            </div>
          ) : selectedRole === 'teacher' ? (
            // Teacher Passkey View
            <div className="space-y-4 sm:space-y-6">
              <button
                onClick={handleBack}
                className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm sm:text-base mb-3 sm:mb-4"
              >
                ← Back
              </button>

              <div className="text-center mb-4 sm:mb-6">
                <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">🔐</div>
                <h3 className="text-xl sm:text-2xl font-bold text-purple-300">
                  Teacher Access
                </h3>
                <p className="text-sm sm:text-base text-gray-400 mt-2 sm:mt-3">
                  Enter the passkey to continue
                </p>
              </div>

              <form onSubmit={handleTeacherSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-purple-200 mb-2 sm:mb-3">
                    Passkey
                  </label>
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    placeholder="Enter teacher passkey"
                    autoFocus
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-900/50 border-2 border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-center text-lg sm:text-xl tracking-widest text-white placeholder-gray-500"
                  />
                </div>

                {error && (
                  <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-center backdrop-blur-sm">
                    <div className="text-xl sm:text-2xl mb-1">⚠️</div>
                    <strong className="text-sm sm:text-base">{error}</strong>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 sm:py-4 px-5 sm:px-6 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
                >
                  {isLoading ? '⏳ Verifying...' : 'Verify & Continue'}
                </button>
              </form>

              <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl">
                <p className="text-xs sm:text-sm text-purple-300 text-center">
                  🔒 Passkey is required for teacher access
                </p>
              </div>
            </div>
          ) : (
            // Student Confirmation View
            <div className="space-y-4 sm:space-y-6">
              <button
                onClick={handleBack}
                className="text-purple-400 hover:text-purple-300 flex items-center gap-2 text-sm sm:text-base mb-3 sm:mb-4"
              >
                ← Back
              </button>

              <div className="text-center mb-4 sm:mb-6">
                <div className="text-5xl sm:text-7xl mb-3 sm:mb-4">👨‍🎓</div>
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-300">
                  Student Access
                </h3>
                <p className="text-sm sm:text-base text-gray-400 mt-2 sm:mt-3">
                  You'll have read-only access
                </p>
              </div>

              <div className="bg-purple-900/40 border border-purple-500/30 rounded-xl p-4 sm:p-5 space-y-2 sm:space-y-3">
                <p className="font-semibold text-purple-300 text-sm sm:text-base">✅ You can:</p>
                <ul className="text-sm sm:text-base text-gray-300 space-y-2 ml-5">
                  <li>• View all student rankings</li>
                  <li>• View performance charts</li>
                  <li>• Export data to CSV</li>
                </ul>
              </div>

              {error && (
                <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-center backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl mb-1">⚠️</div>
                  <strong className="text-sm sm:text-base">{error}</strong>
                </div>
              )}

              <button
                onClick={handleStudentAccess}
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 sm:py-4 px-5 sm:px-6 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
              >
                {isLoading ? '⏳ Loading...' : 'Continue as Student'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 px-5 sm:px-8 py-4 sm:py-5 text-center border-t border-purple-500/30">
          <p className="text-xs sm:text-sm text-gray-400">
            🎓 OCC MeritTrack - HSC Performance Evaluation
          </p>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default RoleSelectionModal;
