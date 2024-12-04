//#Qn6 , #Qn8 Create the User Routes
"use strict";

const express = require("express");
const { User } = require("../models"); // Import the User model
const bcrypt = require("bcryptjs"); // // Include bcrypt.js library for password hashing

const router = express.Router();

// Middleware to parse JSON
//router.use(express.json());

// GET /api/users -- Retrieves the currently authenticated user's information

/**
 * GET /api/users - Retrieve all users' public info (without sensitive fields)
 * Uses Sequelize's attributes option to filter out password, createdAt, and updatedAt.
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "emailAddress"], // Filter out sensitive fields
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve users." });
  }
});

/**
 * Handles SequelizeUniqueConstraintError:
 * When the emailAddress is already in use, Sequelize throws a SequelizeUniqueConstraintError.
 * This is now caught and returns a 400 HTTP status code with an appropriate error message.
 * Handles SequelizeValidationError:
 * Ensures all other validation errors are appropriately handled and returned with detailed error messages.
 */

// POST /api/users -- Creates a new user
router.post("/", async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });

    res.status(201).location("/").end();
  } catch (error) {

    // Check for unique constraint errors (email)
    if (error.name === "SequelizeUniqueConstraintError") {

      res.status(400).json({ message: "The email address is already in use." });
    } else if (error.name === "SequelizeValidationError") {

      // Handle validation errors (empty fields, etc.)
      res.status(400).json({ errors: error.errors.map((err) => err.message) });
    } else {
      res.status(500).json({ error: "Unable to create user." });
    }
  }
});

module.exports = router;
