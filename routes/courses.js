//Qn7 Create the Courses Routes

"use strict";

const express = require("express");
const router = express.Router();
const { Course, User } = require("../models");
const { authMiddleware } = require('../middleware/auth-user'); // Authentication middleware

// GET /api/courses
// EXCEEDS Retrieve all courses along with associated user details
router.get("/", async (req, res) => {
  try {
    const courses = await Course.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Filter out timestamps
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "emailAddress"], // Filter out sensitive user fields
      },
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET /api/courses/:id
// EXCEEDS Retrieve a single course by ID along with associated user details
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      attributes: { exclude: ["createdAt", "updatedAt"] }, // Filter out timestamps
      include: {
        model: User,
        attributes: ["id", "firstName", "lastName", "emailAddress"], // Filter out sensitive user fields
      },
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// POST /api/courses
router.post("/api/courses", async (req, res) => {
  try {
    const { title, description, estimatedTime, materialsNeeded, userId } =
      req.body; // The authenticated user

    // Create a new course
    const course = await Course.create({
      title,
      description,
      estimatedTime,
      materialsNeeded,
      userId,
    });

    // Set the Location header and respond with 201
    res.status(201).location(`/api/courses/${course.id}`).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // #Qn8 Return 400 for validation errors
      res.status(400).json({
        message: "Validation errors",
        errors: error.errors.map((err) => err.message), // Return validation messages
      });
    } else {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

// PUT /api/courses/:id
// EXCEEDS Update a course if the authenticated user is the owner

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      // Ensure user is the course owner
      if (course.userId === req.currentUser.id) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(403).json({ message: 'You are not authorized to update this course.' });
      }
    } else {
      res.status(404).json({ message: 'Course not found.' });
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ errors: error.errors.map((err) => err.message) });
    } else {
      res.status(500).json({ error: 'Unable to update the course.' });
    }
  }
});

// DELETE /api/courses/:id
// EXCEEDS Delete a course if the authenticated user is the owner

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      // Delete the course
      if (course.userId === user.id) {
        await course.destroy();
        res.status(204).end();
      } else {
        res
          .status(403)
          .json({ message: "You are not authorized to delete this course." });
      }
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
