const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllStudents,
  getStudentById,
  addStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, teacherOnly } = require('../middleware/auth');

// Validation rules for adding student
const addStudentValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Student name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('testNumber')
    .isInt({ min: 1 })
    .withMessage('Test number must be a positive integer'),
  body('obtainedMarks')
    .isFloat({ min: 0 })
    .withMessage('Obtained marks must be 0 or greater'),
  body('totalMarks')
    .isFloat({ min: 1 })
    .withMessage('Total marks must be greater than 0')
];

// Public routes (accessible to everyone)
router.get('/', getAllStudents);
router.get('/:id', getStudentById);

// Protected routes (teacher only)
router.post('/', protect, teacherOnly, addStudentValidation, addStudent);
router.put('/:id', protect, teacherOnly, updateStudent);
router.delete('/:id', protect, teacherOnly, deleteStudent);

module.exports = router;
