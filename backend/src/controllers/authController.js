const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          company: result.company,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: 'Refresh token not provided'
        });
      }

      const tokens = await authService.refreshToken(refreshToken);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });

      res.json({
        success: true,
        data: {
          accessToken: tokens.accessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  async logout(req, res) {
    res.clearCookie('refreshToken');
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      const result = await authService.resetPassword(token, password);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async me(req, res) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
          company: req.company
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();