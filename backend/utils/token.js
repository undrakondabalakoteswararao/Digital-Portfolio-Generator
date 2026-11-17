const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'pf_token';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const cookieOptions = () => ({
  httpOnly: true, // JavaScript in the browser cannot read this cookie
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
});

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
const sendAuthCookie = (res, user) => res.cookie(COOKIE_NAME, signToken(user._id), { ...cookieOptions(), maxAge: MAX_AGE });
const clearAuthCookie = (res) => res.clearCookie(COOKIE_NAME, cookieOptions());

module.exports = { COOKIE_NAME, sendAuthCookie, clearAuthCookie };
