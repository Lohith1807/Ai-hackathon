const User = require('../models/User');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middleware/errorHandler');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

exports.requestOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new AppError('Please provide an email address', 400));
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      user = await User.create({ email: email.toLowerCase() });
    }

    const otp = generateOTP();
    // Hash OTP before saving for real production, but plain is okay for hackathon demo given short expiry
    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    await user.save({ validateBeforeSave: false });

    const message = `Your CareNavigator login code is: ${otp}\nThis code is valid for 5 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'CareNavigator Login Code',
        message
      });

      res.status(200).json({
        success: true,
        message: 'OTP sent to email',
        data: {}
      });
    } catch (err) {
      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      console.error(err);
      return next(new AppError('There was an error sending the email. Try again later!', 500));
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return next(new AppError('Please provide email and otp', 400));
    }

    const user = await User.findOne({ 
      email: email.toLowerCase(),
      otp: otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return next(new AppError('The code entered is incorrect or expired', 401, 'INVALID_OTP'));
    }

    const token = signToken(user._id);

    // Clear OTP
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Send token via cookie
    res.cookie('token', token, {
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          email: user.email
        }
      }
    });
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
