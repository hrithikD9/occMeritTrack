const Student = require('../models/Student');
const { validationResult } = require('express-validator');

// @desc    Get all students with rankings
// @route   GET /api/students
// @access  Public (Students and Teachers)
const getAllStudents = async (req, res) => {
  try {
    // Get all students sorted by rank
    const students = await Student.find()
      .sort({ rank: 1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get all students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Public (Students and Teachers)
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

// @desc    Add new student or add test to existing student
// @route   POST /api/students
// @access  Private (Teacher only)
const addStudent = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, testNumber, obtainedMarks, totalMarks } = req.body;

    // Validate marks
    if (obtainedMarks > totalMarks) {
      return res.status(400).json({
        success: false,
        message: 'Obtained marks cannot exceed total marks'
      });
    }

    // Normalize name for case-insensitive search
    const normalizedName = name.trim();

    // Check if student already exists (case-insensitive)
    const existingStudent = await Student.findOne({ 
      name: { $regex: new RegExp(`^${normalizedName}$`, 'i') } 
    });

    if (existingStudent) {
      // Check if test number already exists for this student
      const testExists = existingStudent.tests.some(
        test => test.testNumber === testNumber
      );

      if (testExists) {
        return res.status(400).json({
          success: false,
          message: `Test ${testNumber} already exists for ${existingStudent.name}`
        });
      }

      // Add new test to existing student
      existingStudent.tests.push({
        testNumber,
        obtainedMarks,
        totalMarks
      });

      await existingStudent.save();

      // Fetch updated student with new rank
      const updatedStudent = await Student.findById(existingStudent._id);

      return res.status(200).json({
        success: true,
        message: `Test ${testNumber} added to ${updatedStudent.name}`,
        data: updatedStudent
      });
    } else {
      // Create new student
      const newStudent = await Student.create({
        name: normalizedName,
        tests: [{
          testNumber,
          obtainedMarks,
          totalMarks
        }]
      });

      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: newStudent
      });
    }
  } catch (error) {
    console.error('Add student error:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A student with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error adding student',
      error: error.message
    });
  }
};

// @desc    Update student marks or tests
// @route   PUT /api/students/:id
// @access  Private (Teacher only)
const updateStudent = async (req, res) => {
  try {
    const { testIndex, obtainedMarks, totalMarks } = req.body;

    // Validate marks
    if (obtainedMarks !== undefined && totalMarks !== undefined) {
      if (obtainedMarks > totalMarks) {
        return res.status(400).json({
          success: false,
          message: 'Obtained marks cannot exceed total marks'
        });
      }
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update specific test
    if (testIndex !== undefined) {
      if (testIndex < 0 || testIndex >= student.tests.length) {
        return res.status(400).json({
          success: false,
          message: 'Invalid test index'
        });
      }

      if (obtainedMarks !== undefined) {
        student.tests[testIndex].obtainedMarks = obtainedMarks;
      }
      if (totalMarks !== undefined) {
        student.tests[testIndex].totalMarks = totalMarks;
      }

      // Recalculate percentage for this test
      const test = student.tests[testIndex];
      test.percentage = (test.obtainedMarks / test.totalMarks) * 100;
    }

    await student.save();

    // Fetch updated student with new rank
    const updatedStudent = await Student.findById(student._id);

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private (Teacher only)
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
};
