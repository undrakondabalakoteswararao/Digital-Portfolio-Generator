const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

// Public route first (no authentication)
router.get('/public/:slug', c.getPublic);

router.use(protect);
router.get('/me', c.getMine);
router.put(
  '/me',
  [body('slug').optional().trim().toLowerCase().isLength({ min: 3, max: 40 }).withMessage('Link must be 3-40 characters.').matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).withMessage('Use lowercase letters, numbers and single hyphens only.')],
  validate,
  c.updateMine
);
router.post('/publish', c.publish);
router.post('/unpublish', c.unpublish);

module.exports = router;
