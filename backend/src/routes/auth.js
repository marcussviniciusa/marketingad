const router = require('express').Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validateRegister, validateLogin } = require('../validators/auth');

// Public routes
router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', authenticate, authController.me);
router.post('/logout', authenticate, authController.logout);

module.exports = router;