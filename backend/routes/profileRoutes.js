const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const list = (field) => body(field).optional().isArray({ max: 50 }).withMessage(`${field} must be a list of up to 50 items.`);

router.use(protect);
router.get('/', c.getProfile);
router.put(
  '/',
  [
    body('name').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters.'),
    body('contactEmail').optional({ checkFalsy: true }).isEmail().withMessage('Enter a valid contact email.'),
    ...['education', 'skills', 'projects', 'experience', 'certifications', 'achievements', 'languages', 'interests', 'hobbies'].map(list),
  ],
  validate,
  c.updateProfile
);
router.post('/upload-image', upload, c.uploadProfileImage);
router.post('/upload-project-image', upload, c.uploadProjectImage);

module.exports = router;
