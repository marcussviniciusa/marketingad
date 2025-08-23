const jwt = require('jsonwebtoken');
const { User, Company, UserCompany } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found or inactive'
      });
    }

    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

const authorizeCompany = async (req, res, next) => {
  try {
    const companyId = req.headers['x-company-id'] || req.params.companyId || req.body.companyId;
    
    if (!companyId) {
      return res.status(400).json({
        success: false,
        error: 'Company ID required'
      });
    }

    const userCompany = await UserCompany.findOne({
      where: {
        userId: req.userId,
        companyId: companyId
      },
      include: [{
        model: Company,
        attributes: ['id', 'name', 'slug', 'plan', 'isActive']
      }]
    });

    if (!userCompany) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this company'
      });
    }

    if (!userCompany.Company.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Company is inactive'
      });
    }

    req.company = userCompany.Company;
    req.companyId = companyId;
    req.userRole = userCompany.role;
    req.permissions = userCompany.permissions;

    // Update last access
    await userCompany.update({ lastAccessAt: new Date() });

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (roles.includes(req.userRole)) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: 'Insufficient permissions'
    });
  };
};

const checkPermission = (resource, action) => {
  return (req, res, next) => {
    if (req.user.role === 'superadmin') {
      return next();
    }

    if (req.userRole === 'owner' || req.userRole === 'admin') {
      return next();
    }

    const hasPermission = req.permissions?.[resource]?.[action];
    
    if (hasPermission) {
      return next();
    }

    res.status(403).json({
      success: false,
      error: `No permission to ${action} ${resource}`
    });
  };
};

module.exports = {
  authenticate,
  authorizeCompany,
  authorize,
  checkPermission
};