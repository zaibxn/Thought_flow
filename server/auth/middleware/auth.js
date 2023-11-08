import jwt from 'jsonwebtoken';
import User from '../../models/user.js';

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    jwt.verify(token, user.password);

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Unauthorized: Error verifying token', error: error.message });
  }
};

export default requireAuth;
