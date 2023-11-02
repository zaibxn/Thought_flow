import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import zxcvbn from 'zxcvbn';

dotenv.config();

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    username,
    email,
    password,
    gender,
    agreeToTwoGenders
  } = req.body;

  try {
    // Convert email and username to lowercase
    const lowerCaseEmail = email.toLowerCase();
    const lowerCaseUsername = username.toLowerCase();

    // Check if the email and username are already in use
    const existingEmail = await User.findOne({ email: lowerCaseEmail });
    const existingUsername = await User.findOne({ username: lowerCaseUsername });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Username taken' });
    }

    // Check password strength
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return res.status(400).json({ message: 'Password is not strong enough' });
    }

    // Check if password contains username or date of birth
    if (password.includes(lowerCaseUsername) || password.includes(dob)) {
      return res.status(400).json({ message: 'Password should not contain username or date of birth' });
    }

    const saltRounds = 10; // You can adjust the number of salt rounds
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const dobDate = new Date(dob);
    const user = await User.create({
      firstName,
      lastName,
      dob: dobDate,
      username: lowerCaseUsername,
      email: lowerCaseEmail,
      password: hashedPassword,
      gender,
      agreeToTwoGenders
    });

    const token = createToken(user._id);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: usernameOrEmail.toLowerCase() },
        { username: usernameOrEmail.toLowerCase() },
      ],
    });

    if (user) {
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = createToken(user._id);
        res.status(200).json({ user, token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const checkUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const existingUsername = await User.findOne({ username: username.toLowerCase() });

    if (existingUsername) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

const checkEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });

    if (existingEmail) {
      return res.status(200).json({ exists: true });
    }

    return res.status(200).json({ exists: false });
  } catch (err) {
    res.status(400).json(err.message);
  }
};

export { register, login, checkUsername, checkEmail };
