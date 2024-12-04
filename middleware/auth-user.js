const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate the user
module.exports.authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const [email, password] = Buffer.from(authorization.split(' ')[1], 'base64')
      .toString()
      .split(':');

    try {
      const user = await User.findOne({ where: { emailAddress: email } });

      if (user && (await bcrypt.compare(password, user.password))) {
        req.currentUser = user; // Attach user to the request
        return next(); // Proceed to next middleware or route handler
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  res.status(401).json({ message: 'Access Denied' }); // Authentication failed
};
