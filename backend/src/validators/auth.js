const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase and number'),
  body('firstName')
    .notEmpty()
    .trim()
    .withMessage('First name required'),
  body('lastName')
    .notEmpty()
    .trim()
    .withMessage('Last name required'),
  body('companyName')
    .notEmpty()
    .trim()
    .withMessage('Company name required'),
  handleValidation
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .notEmpty()
    .withMessage('Password required'),
  handleValidation
];

module.exports = {
  validateRegister,
  validateLogin
};