// Helper function to calculate final percentage using weighted calculation
export const calculateFinalPercentage = (tests) => {
  if (!tests || tests.length === 0) return 0;
  
  const totalObtained = tests.reduce((sum, test) => sum + test.obtainedMarks, 0);
  const totalPossible = tests.reduce((sum, test) => sum + test.totalMarks, 0);
  
  if (totalPossible === 0) return 0;
  
  return ((totalObtained / totalPossible) * 100).toFixed(2);
};

// Helper function to calculate average marks (kept for backward compatibility)
export const calculateAverage = (marks) => {
  if (!marks || marks.length === 0) return 0;
  const sum = marks.reduce((acc, mark) => acc + mark, 0);
  return (sum / marks.length).toFixed(2);
};

// Helper function to rank candidates based on final percentage
// Tie-breaking rules:
// 1. Higher percentage wins
// 2. If same percentage -> More tests taken wins
// 3. If same percentage and test count -> Higher total marks wins
// 4. Only if all three match -> They tie (same rank)
export const rankCandidates = (candidates) => {
  // First, calculate percentages and prepare data
  const candidatesWithData = candidates
    .map((candidate) => {
      const tests = candidate.tests || [];
      const totalMarksSum = tests.reduce((sum, test) => sum + test.totalMarks, 0);
      
      return {
        ...candidate,
        finalPercentage: parseFloat(calculateFinalPercentage(tests)),
        testCount: tests.length,
        totalMarksSum: totalMarksSum,
        // Keep old structure for backward compatibility
        average: candidate.marks ? parseFloat(calculateAverage(candidate.marks)) : 0
      };
    })
    .sort((a, b) => {
      // Primary: Sort by percentage (descending)
      if (b.finalPercentage !== a.finalPercentage) {
        return b.finalPercentage - a.finalPercentage;
      }
      
      // Secondary: Sort by number of tests taken (descending)
      if (b.testCount !== a.testCount) {
        return b.testCount - a.testCount;
      }
      
      // Tertiary: Sort by total marks sum (descending)
      if (b.totalMarksSum !== a.totalMarksSum) {
        return b.totalMarksSum - a.totalMarksSum;
      }
      
      // If all match, they're truly equal (will get same rank)
      return 0;
    });
  
  // Assign ranks with tie handling - TWO PASS APPROACH
  // First pass: assign ranks
  const rankedCandidates = [];
  let currentRank = 1;
  let previousRank = 1;
  
  candidatesWithData.forEach((candidate, index) => {
    let assignedRank;
    
    // Check if this candidate should tie with the previous one
    if (index > 0) {
      const prev = candidatesWithData[index - 1];
      
      // Use small epsilon for floating point comparison
      const percentageMatch = Math.abs(prev.finalPercentage - candidate.finalPercentage) < 0.01;
      const testCountMatch = prev.testCount === candidate.testCount;
      const totalMarksMatch = prev.totalMarksSum === candidate.totalMarksSum;
      
      const shouldTie = percentageMatch && testCountMatch && totalMarksMatch;
      
      if (shouldTie) {
        // Same rank as previous candidate
        assignedRank = previousRank;
      } else {
        // New rank (skip numbers if there were ties before)
        currentRank = index + 1;
        assignedRank = currentRank;
        previousRank = currentRank;
      }
    } else {
      // First candidate
      assignedRank = 1;
      previousRank = 1;
    }
    
    rankedCandidates.push({
      ...candidate,
      rank: assignedRank
    });
  });
  
  return rankedCandidates;
};

// Helper function to determine performance status
export const getPerformanceStatus = (candidate) => {
  const finalPercentage = candidate.finalPercentage || candidate.average || 0;
  const testsData = candidate.tests || candidate.marks;
  
  if (!testsData || testsData.length === 0) return 'No Data';
  
  // Analyze trend if there are multiple tests
  let trend = 'stable';
  if (testsData.length >= 2) {
    const percentages = testsData.map(test => 
      typeof test === 'object' ? test.percentage : test
    );
    
    // Calculate trend: compare first half vs second half
    const midPoint = Math.floor(percentages.length / 2);
    const firstHalf = percentages.slice(0, midPoint);
    const secondHalf = percentages.slice(midPoint);
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg - firstAvg >= 5) trend = 'improving';
    else if (firstAvg - secondAvg >= 5) trend = 'declining';
  }
  
  // Determine status based on final percentage and trend
  if (finalPercentage >= 95) {
    return trend === 'improving' ? 'Phenomenal' : trend === 'declining' ? 'Excellent' : 'Genius';
  } else if (finalPercentage >= 90) {
    return trend === 'improving' ? 'Rising Star' : trend === 'declining' ? 'Outstanding' : 'Exceptional';
  } else if (finalPercentage >= 85) {
    return trend === 'improving' ? 'Ascending' : trend === 'declining' ? 'Impressive' : 'Brilliant';
  } else if (finalPercentage >= 80) {
    return trend === 'improving' ? 'Flourishing' : trend === 'declining' ? 'Good' : 'Excellent';
  } else if (finalPercentage >= 75) {
    return trend === 'improving' ? 'Advancing' : trend === 'declining' ? 'Average' : 'Strong';
  } else if (finalPercentage >= 70) {
    return trend === 'improving' ? 'Progressing' : trend === 'declining' ? 'Slipping' : 'Proficient';
  } else if (finalPercentage >= 60) {
    return trend === 'improving' ? 'Developing' : trend === 'declining' ? 'Declining' : 'Adequate';
  } else if (finalPercentage >= 50) {
    return trend === 'improving' ? 'Emerging' : 'Needs Support';
  } else {
    return trend === 'improving' ? 'Improving' : 'Struggling';
  }
};

// Helper function to get rank color class
export const getRankColor = (rank) => {
  if (rank === 1) return 'bg-gradient-to-r from-red-900/40 to-pink-900/40 border-l-4 border-red-500 text-red-200';
  if (rank === 2) return 'bg-gradient-to-r from-purple-900/40 to-violet-900/40 border-l-4 border-purple-500 text-purple-200';
  if (rank === 3) return 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-l-4 border-green-500 text-green-200';
  return 'bg-gray-800/30 text-gray-200';
};

// Helper function to export data to CSV
export const exportToCSV = (candidates) => {
  const rankedCandidates = rankCandidates(candidates);
  
  // Create CSV header
  const headers = ['Rank', 'Name', 'Test Details', 'Final Percentage', 'Total Tests'];
  
  // Create CSV rows
  const rows = rankedCandidates.map(candidate => {
    const tests = candidate.tests || [];
    const testDetails = tests.map((test, idx) => 
      `T${idx + 1}: ${test.obtainedMarks}/${test.totalMarks} (${test.percentage.toFixed(2)}%)`
    ).join('; ');
    
    return [
      candidate.rank,
      candidate.name,
      testDetails || 'No tests',
      `${candidate.finalPercentage}%`,
      tests.length
    ];
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `OCC_MeritTrack_Rankings_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to get data by specific test number
export const filterByTestNumber = (candidates, testNumber) => {
  if (!testNumber) return candidates;
  
  return candidates
    .filter(candidate => {
      const tests = candidate.tests || [];
      return tests.length >= testNumber;
    })
    .map(candidate => {
      const tests = candidate.tests || [];
      const specificTest = tests[testNumber - 1];
      
      // Return candidate with only the specific test, but calculate percentage for just that test
      return {
        ...candidate,
        tests: [specificTest],
        finalPercentage: specificTest ? specificTest.percentage : 0
      };
    });
};
