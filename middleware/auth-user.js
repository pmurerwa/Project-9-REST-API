//Qn6 Implemented routes/users.js Middleware for authentication
"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const auth = require("basic-auth"); // For parsing the Authorization header

exports.authenticateUser = async (req, res, next) => {
  const credentials = auth(req);

  if (credentials) {
    try {
      const user = await User.findOne({
        where: { emailAddress: credentials.name },
      });

      if (user && bcrypt.compareSync(credentials.pass, user.password)) {
        req.currentUser = user; // Attach the authenticated user to the request object
        return next();
      } else {
        res.status(401).json({ message: 'Authentication failed.' });
      }
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({ message: 'Authentication required.' });
  }
};
