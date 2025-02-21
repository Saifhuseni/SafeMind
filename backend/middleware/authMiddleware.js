const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.split(' ')[1];

  // Check if no token
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, config.get('JWT_SECRET'));
    req.user = decoded; // Attach decoded user info to req.user
    console.log("Decoded user:", decoded);  // Log the decoded user for debugging
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("Token verification failed:", err); // Log error for debugging
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
