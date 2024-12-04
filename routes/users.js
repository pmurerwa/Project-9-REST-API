//Qn6 Create the User Routes
"use strict";

const express = require("express");
const { User } = require("../models"); // Import the User model
const bcrypt = require("bcryptjs"); // For password hashing
const { authenticateUser } = require("../middleware/auth-user"); // import the implemented Middleware for authentication 

const router = express.Router();

// Middleware to parse JSON
router.use(express.json());

// GET /api/users - Returns the currently authenticated user
router.get("/", authenticateUser, async (req, res, next) => {
  try {
    const user = req.currentUser; // Set by authenticateUser middleware

    // Return all properties of the authenticated user
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  } catch (error) {
    //next(error);
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /api/users - Create a new user
router.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, emailAddress, password } = req.body;

    if (!firstName || !lastName || !emailAddress || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create the new user
    await User.create({
      firstName,
      lastName,
      emailAddress,
      password: hashedPassword,
    });

    // Set the Location header and respond with 201
    res.status(201).location("/").end();
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ message: "Email address already exists." });
    } else if (error.name === "SequelizeValidationError") {
      res.status(400).json({ message: error.errors.map((err) => err.message) });
    } else {
      //next(error);
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

module.exports = router;
