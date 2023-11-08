// user/controllers/user.js
import User from '../../models/user.js';

const getUserProfile = (req, res) => {
  res.status(200).json({ user: req.user });
};

export { getUserProfile };
