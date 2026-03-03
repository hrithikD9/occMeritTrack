const mongoose = require('mongoose');

// Test schema for individual test entries
const testSchema = new mongoose.Schema({
  testNumber: {
    type: Number,
    required: [true, 'Test number is required'],
    min: [1, 'Test number must be positive']
  },
  obtainedMarks: {
    type: Number,
    required: [true, 'Obtained marks are required'],
    min: [0, 'Obtained marks cannot be negative']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks are required'],
    min: [1, 'Total marks must be positive']
  },
  percentage: {
    type: Number,
    default: 0
  }
}, { _id: false });

// Main Student schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Student name is required'],
    trim: true
  },
  tests: {
    type: [testSchema],
    default: []
  },
  finalPercentage: {
    type: Number,
    default: 0
  },
  rank: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create case-insensitive unique index for name
studentSchema.index({ name: 1 }, { 
  unique: true, 
  collation: { locale: 'en', strength: 2 } 
});

// Pre-save middleware to calculate test percentages
testSchema.pre('validate', function(next) {
  if (this.obtainedMarks > this.totalMarks) {
    next(new Error('Obtained marks cannot exceed total marks'));
  } else {
    this.percentage = (this.obtainedMarks / this.totalMarks) * 100;
    next();
  }
});

// Method to calculate final percentage (weighted average)
studentSchema.methods.calculateFinalPercentage = function() {
  if (!this.tests || this.tests.length === 0) {
    this.finalPercentage = 0;
    return 0;
  }

  const totalObtained = this.tests.reduce((sum, test) => sum + test.obtainedMarks, 0);
  const totalPossible = this.tests.reduce((sum, test) => sum + test.totalMarks, 0);

  this.finalPercentage = totalPossible > 0 
    ? Number(((totalObtained / totalPossible) * 100).toFixed(2))
    : 0;

  return this.finalPercentage;
};

// Static method to recalculate all ranks
// Tie-breaking rules:
// 1. Higher percentage wins
// 2. If same percentage -> More tests taken wins
// 3. If same percentage and test count -> Higher total marks wins
// 4. Only if all three match -> They tie (same rank)
studentSchema.statics.recalculateRanks = async function() {
  try {
    // Get all students
    const students = await this.find();
    
    // Calculate additional data and sort
    const studentsWithData = students.map(student => {
      const totalMarksSum = student.tests.reduce((sum, test) => sum + test.totalMarks, 0);
      return {
        _id: student._id,
        finalPercentage: student.finalPercentage,
        testCount: student.tests.length,
        totalMarksSum: totalMarksSum,
        name: student.name
      };
    }).sort((a, b) => {
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
      
      // Quaternary: Sort by name (alphabetically) for consistency
      return a.name.localeCompare(b.name);
    });

    // Assign ranks with tie handling
    const bulkOps = [];
    let currentRank = 1;
    
    studentsWithData.forEach((student, index) => {
      let assignedRank;
      
      // Check if this student should tie with the previous one
      // They tie only if percentage, test count, AND total marks all match
      if (index > 0) {
        const prev = studentsWithData[index - 1];
        const shouldTie = 
          prev.finalPercentage === student.finalPercentage &&
          prev.testCount === student.testCount &&
          prev.totalMarksSum === student.totalMarksSum;
        
        if (shouldTie) {
          // Same rank as previous student
          assignedRank = bulkOps[index - 1].updateOne.update.rank;
        } else {
          // New rank (could skip numbers if there were ties before)
          currentRank = index + 1;
          assignedRank = currentRank;
        }
      } else {
        // First student
        assignedRank = 1;
      }
      
      bulkOps.push({
        updateOne: {
          filter: { _id: student._id },
          update: { rank: assignedRank }
        }
      });
    });

    // Execute bulk update
    if (bulkOps.length > 0) {
      await this.bulkWrite(bulkOps);
    }

    return students;
  } catch (error) {
    console.error('Error recalculating ranks:', error);
    throw error;
  }
};

// Pre-save hook to calculate final percentage before saving
studentSchema.pre('save', function(next) {
  // Calculate percentage for each test
  this.tests.forEach(test => {
    if (test.totalMarks > 0) {
      test.percentage = Number(((test.obtainedMarks / test.totalMarks) * 100).toFixed(2));
    }
  });

  // Calculate final percentage
  this.calculateFinalPercentage();
  next();
});

// Post-save hook to recalculate ranks after any student change
studentSchema.post('save', async function(doc, next) {
  try {
    await this.constructor.recalculateRanks();
    next();
  } catch (error) {
    next(error);
  }
});

// Post-delete hook to recalculate ranks after deletion
studentSchema.post('findOneAndDelete', async function(doc, next) {
  try {
    if (doc) {
      await doc.constructor.recalculateRanks();
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
