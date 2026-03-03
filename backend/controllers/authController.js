const jwt = require('jsonwebtoken');

// @desc    Teacher login with passkey
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { passkey, role } = req.body;

    // Validate role is provided
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide role'
      });
    }

    // Check role
    if (role === 'teacher') {
      // Verify teacher passkey is provided
      if (!passkey) {
        return res.status(400).json({
          success: false,
          message: 'Please provide passkey for teacher access'
        });
      }

      // Verify teacher passkey
      if (passkey !== process.env.TEACHER_PASSKEY) {
        return res.status(401).json({
          success: false,
          message: 'Invalid passkey'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { role: 'teacher' },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
      );

      res.status(200).json({
        success: true,
        data: {
          role: 'teacher',
          token
        }
      });
    } else if (role === 'student') {
      // Students don't need authentication, just return role
      // No token needed for read-only access
      res.status(200).json({
        success: true,
        data: {
          role: 'student',
          token: null // Students don't get tokens
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "teacher" or "student"'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    // If middleware passed, token is valid
    res.status(200).json({
      success: true,
      data: {
        role: req.userRole,
        valid: true
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during token verification'
    });
  }
};

module.exports = {
  login,
  verifyToken
};
