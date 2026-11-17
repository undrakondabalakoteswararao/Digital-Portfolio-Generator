const router = require('express').Router();
const { body } = require('express-validator');
const c = require('../controllers/templateController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { TEMPLATE_IDS } = require('../models/Portfolio');

router.get('/', c.list);
router.put('/select', protect, [body('templateId').isIn(TEMPLATE_IDS).withMessage('Unknown template.')], validate, c.select);

module.exports = router;
