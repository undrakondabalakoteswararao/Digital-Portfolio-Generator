const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const c = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again in a few minutes.' },
});

const name = body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters.');
const email = body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail();
const strongPassword = (field) =>
  body(field)
    .isLength({ min: 8, max: 72 }).withMessage('Password must be 8-72 characters.')
    .matches(/[A-Za-z]/).withMessage('Password must contain a letter.')
    .matches(/\d/).withMessage('Password must contain a number.');

router.post(
  '/register',
  authLimiter,
  [name, email, strongPassword('password'), body('confirmPassword').custom((v, { req }) => v === req.body.password).withMessage('Passwords do not match.')],
  validate,
  c.register
);
router.post('/login', authLimiter, [email, body('password').notEmpty().withMessage('Password is required.')], validate, c.login);
router.post('/logout', c.logout);
router.get('/me', protect, c.me);
router.put('/account', protect, [name, email], validate, c.updateAccount);
router.put(
  '/password',
  protect,
  authLimiter,
  [body('currentPassword').notEmpty().withMessage('Enter your current password.'), strongPassword('newPassword')],
  validate,
  c.changePassword
);

module.exports = router;
