import User from '../../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import zxcvbn from 'zxcvbn';
import cookie from 'cookie'; // Import the 'cookie' library

dotenv.config();

const createDynamicSecret = (user) => {
  return user.password; // You can adjust this based on your requirements
};

const createToken = (id, user) => {
  return jwt.sign({ id }, createDynamicSecret(user), {
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
    const lowerCaseEmail = email.toLowerCase();
    const lowerCaseUsername = username.toLowerCase();

    const existingEmail = await User.findOne({ email: lowerCaseEmail });
    const existingUsername = await User.findOne({ username: lowerCaseUsername });

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Username taken' });
    }

    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      return res.status(400).json({ message: 'Password is not strong enough' });
    }

    if (password.includes(lowerCaseUsername) || password.includes(dob)) {
      return res.status(400).json({ message: 'Password should not contain username or date of birth' });
    }

    const saltRounds = 10;
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

    const token = createToken(user._id, user);

    // Set the JWT token as a cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 3600, // Token expiration time in seconds (1 hour)
    }));

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
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Create a new token for the user
        const newToken = createToken(user._id, user);

        // Set the new JWT token as a cookie
        res.setHeader('Set-Cookie', cookie.serialize('token', newToken, {
          httpOnly: true,
          sameSite: 'strict',
          maxAge: 3600, // Token expiration time in seconds (1 hour)
        }));

        res.status(200).json({ user, token: newToken });
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
