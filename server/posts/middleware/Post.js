// import jwt from 'jsonwebtoken';
// import User from '../../models/user.js';

// const requireAuth = async (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }

//   try {
//     console.log('Received Token:', token); // Log the token received
//     const decodedToken = jwt.verify(token, createDynamicSecretFromUser);
//     console.log('Decoded Token:', decodedToken); // Log the decoded token

//     const user = await User.findById(decodedToken.id);
//     console.log('User:', user); // Log the user associated with the token

//     if (!user) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }

//     req.user = user; // Set the user in the request object
//     next();
//   } catch (error) {
//     console.error('Error:', error); // Log any errors that occur during token verification
//     res.status(401).json({ message: 'Unauthorized' });
//   }
// };

// const createDynamicSecretFromUser = (decodedToken, callback) => {
//   if (decodedToken && decodedToken.id) {
//     User.findById(decodedToken.id, (err, user) => {
//       if (err || !user) {
//         callback(err, null);
//       } else {
//         callback(null, user.password);
//       }
//     });
//   } else {
//     callback('Invalid token', null);
//   }
// };

// export default requireAuth;
