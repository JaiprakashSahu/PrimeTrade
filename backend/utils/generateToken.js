import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for user authentication
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId) => {
  // Create token with user ID as payload
  const token = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d' // Token expires in 1 day
    }
  );
  
  return token;
};

export default generateToken;
