//#Qn6 , #Qn8 Create the User Routes
"use strict";

const express = require("express");
const { User } = require("../models"); // Import the User model
const bcrypt = require("bcrypt"); // // Include bcrypt.js library for password hashing
const authMiddleware = require('../middleware/auth-user');

const router = express.Router();

// GET /api/users - Return the currently authenticated user
//This is working right in Postman but not in the app!!! (message": "Access Denied")
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = req.currentUser;
    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  } catch (error) {
    res.status(500).json({ error: 'Unable to retrieve user.' });
  }
});


// POST /api/users -- Creates a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).location('/').end();
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'The email address is already in use.' });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ errors: error.errors.map((err) => err.message) });
    } else {
      res.status(500).json({ error: 'Unable to create user.' });
    }
  }
});

module.exports = router;
