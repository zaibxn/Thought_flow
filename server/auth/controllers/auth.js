import jwt from 'jsonwebtoken';
import User from '../../models/user.js';
import bcrypt from 'bcrypt';
import cookie from 'cookie';
import zxcvbn from 'zxcvbn';

const createToken = (id, secret) => {
  return jwt.sign({ id }, secret, { expiresIn: '1h' });
};

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

const register = async (req, res) => {
  const {
    firstName,
    lastName,
    dob,
    username,
    email,
    password,
    gender,
    agreeToTwoGenders,
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
      return res
        .status(400)
        .json({ message: 'Password should not contain username or date of birth' });
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
      agreeToTwoGenders,
    });

    const token = createToken(user._id, hashedPassword);

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 3600, // Token expiration time in seconds (1 hour)
      })
    );

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).json({ message: 'Registration failed', error: error.message });
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
        const token = createToken(user._id, user.password);

        res.setHeader(
          'Set-Cookie',
          cookie.serialize('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 3600, // Token expiration time in seconds (1 hour)
          })
        );

        res.status(200).json({ user, token });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ message: 'Login failed', error: error.message });
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
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(400).json({ message: 'Username check failed', error: error.message });
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
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(400).json({ message: 'Email check failed', error: error.message });
  }
};

export { register, login, checkUsername, checkEmail, requireAuth };
