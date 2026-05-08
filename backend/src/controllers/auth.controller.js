const User = require('../models/user.model');
const generateToken = require('../utils/jwt');

const normalizeEmail = (email = '') => String(email).trim().toLowerCase();
const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const buildEmailMatcher = (email = '') => new RegExp(`^${escapeRegex(normalizeEmail(email))}$`, 'i');

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, semester } = req.body;
    const normalizedName = typeof name === 'string' ? name.trim() : '';
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedName || !normalizedEmail || typeof password !== 'string' || !password) {
      res.status(400);
      throw new Error('Name, email, and password are required');
    }

    const userExists = await User.findOne({ email: buildEmailMatcher(normalizedEmail) });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      semester,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        semester: user.semester,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// Authenticate user & get token
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || typeof password !== 'string' || !password) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const user = await User.findOne({ email: buildEmailMatcher(normalizedEmail) });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        semester: user.semester,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// Get user profile
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        semester: user.semester,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
