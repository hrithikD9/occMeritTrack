const jwt = require('jsonwebtoken');

// Middleware to protect routes - requires valid JWT token
const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user role to request
      req.userRole = decoded.role;

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

// Middleware to restrict access to teachers only
const teacherOnly = (req, res, next) => {
  if (req.userRole !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Teacher privileges required.'
    });
  }
  next();
};

module.exports = { protect, teacherOnly };
