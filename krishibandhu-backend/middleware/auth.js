const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../utils/auth');

const authenticate = (req, res, next) => {
  const token = req.cookies.kb_token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

module.exports = authenticate;
