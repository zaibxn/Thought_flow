import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../../models/user.js';

dotenv.config();

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    // Verify the token using a dynamic secret
    jwt.verify(token, createDynamicSecretFromUser, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
      } else {
        // Check if the user associated with the token exists
        User.findById(decodedToken.id, (err, user) => {
          if (err || !user) {
            res.status(401).json({ message: 'Unauthorized' });
          } else {
            req.user = user;
            next();
          }
        });
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Create a dynamic secret based on user-specific information
const createDynamicSecretFromUser = (decodedToken, callback) => {
  if (decodedToken && decodedToken.id) {
    User.findById(decodedToken.id, (err, user) => {
      if (err || !user) {
        callback(err, null);
      } else {
        callback(null, user.password);
      }
    });
  } else {
    callback('Invalid token', null);
  }
};

export default requireAuth;
