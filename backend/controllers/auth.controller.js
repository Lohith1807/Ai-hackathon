const prisma = require('../prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AppError } = require('../middleware/errorHandler');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user.id);

  res.cookie('token', token, {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message,
    data: { user: { id: user.id, email: user.email, mobile: user.mobile } }
  });
};

exports.register = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return next(new AppError('Please provide an email/mobile and password', 400));
    }

    const isEmail = identifier.includes('@');
    const email = isEmail ? identifier.toLowerCase() : null;
    const mobile = !isEmail ? identifier : null;
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || undefined },
          { mobile: mobile || undefined }
        ]
      }
    });

    if (existingUser) {
      return next(new AppError('User already exists with this email or mobile', 400));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        mobile: mobile,
        password: hashedPassword
      }
    });

    createSendToken(newUser, 201, res, 'Registered successfully');
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return next(new AppError('Please provide email/mobile and password', 400));
    }

    const isEmail = identifier.includes('@');

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: isEmail ? identifier.toLowerCase() : undefined },
          { mobile: !isEmail ? identifier : undefined }
        ]
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Incorrect email/mobile or password', 401));
    }

    createSendToken(user, 200, res, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, data: {}, message: 'Logged out successfully' });
};
