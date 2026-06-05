const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Otp = require('../models/Otp');
const { getJwtSecret } = require('../utils/auth');

const isValidPhoneNumber = (phoneNumber) => /^\d{10}$/.test(phoneNumber);
const isValidOtp = (otp) => /^\d{4}$/.test(otp);

router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save to DB (upsert just in case they request multiple times)
    await Otp.findOneAndUpdate(
      { phoneNumber },
      { otp, createdAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );

    // In a real app, send via SMS here. For now, log it.
    console.log(`[DEV ONLY] OTP for ${phoneNumber} is ${otp}`);
    
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in send-otp:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Valid 10-digit phone number is required' });
    }
    if (!isValidOtp(otp)) {
      return res.status(400).json({ error: 'Valid 4-digit OTP is required' });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ phoneNumber, otp });
    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Find or create User
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber, isVerified: true });
      await user.save();
    }

    // OTP used, delete it
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, phone: phoneNumber, role: user.role },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    res.cookie('kb_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, user: { id: user._id, phone: user.phoneNumber, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('kb_token');
  res.json({ success: true });
});

router.get('/check', async (req, res) => {
  const token = req.cookies.kb_token;
  
  if (!token) {
    return res.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    
    // Optional: fetch fresh user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      res.clearCookie('kb_token');
      return res.json({ authenticated: false });
    }

    return res.json({ 
      authenticated: true, 
      user: { id: user._id, phone: user.phoneNumber, name: user.name, role: user.role }
    });
  } catch (error) {
    res.clearCookie('kb_token');
    return res.json({ authenticated: false });
  }
});

module.exports = router;
