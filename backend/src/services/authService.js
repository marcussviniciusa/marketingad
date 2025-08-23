const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Company, UserCompany } = require('../models');

class AuthService {
  generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );

    return { accessToken, refreshToken };
  }

  verifyToken(token, type = 'access') {
    const secret = type === 'refresh' ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;
    return jwt.verify(token, secret);
  }

  async register(data) {
    const { email, password, firstName, lastName, companyName } = data;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: 'admin'
    });

    // Create company
    const company = await Company.create({
      name: companyName,
      slug: this.generateSlug(companyName),
      email,
      plan: 'free'
    });

    // Associate user with company as owner
    await UserCompany.create({
      userId: user.id,
      companyId: company.id,
      role: 'owner',
      isDefault: true,
      permissions: {
        campaigns: { create: true, read: true, update: true, delete: true },
        landingPages: { create: true, read: true, update: true, delete: true },
        leads: { create: true, read: true, update: true, delete: true },
        analytics: { read: true },
        settings: { manage: true },
        users: { manage: true },
        billing: { manage: true }
      }
    });

    const tokens = this.generateTokens(user.id);

    return {
      user: user.toJSON(),
      company: company.toJSON(),
      ...tokens
    };
  }

  async login(email, password) {
    // Find user with companies
    const user = await User.findOne({
      where: { email },
      include: [{
        model: Company,
        as: 'companies',
        through: { attributes: ['role', 'permissions', 'isDefault'] }
      }]
    });

    if (!user || !await user.comparePassword(password)) {
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Update last login
    await user.update({ lastLogin: new Date() });

    const tokens = this.generateTokens(user.id);

    return {
      user: user.toJSON(),
      ...tokens
    };
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = this.verifyToken(refreshToken, 'refresh');
      
      const user = await User.findByPk(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      return this.generateTokens(user.id);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async forgotPassword(email) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires
    });

    // TODO: Send email with reset link
    
    return { 
      message: 'If the email exists, a reset link has been sent',
      token: resetToken // Remove in production
    };
  }

  async resetPassword(token, newPassword) {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    await user.update({
      password: newPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return { message: 'Password reset successfully' };
  }

  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      + '-' + Date.now().toString(36);
  }
}

module.exports = new AuthService();