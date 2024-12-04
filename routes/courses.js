//Qn7 Create the Courses Routes

'use strict';

const express = require('express');
const router = express.Router();
const { Course, User } = require('../models');

// Middleware to parse JSON
router.use(express.json());

// GET /api/courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'], // include user data
      }],
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/courses/:id
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'], // include user data
      }],
    });

    if (course) {
      res.status(200).json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/courses
router.post('/', async (req, res) => {
  try {
    const { title, description, estimatedTime, materialsNeeded, userId } = req.body;

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
    console.error(error);
    res.status(400).json({ message: 'Bad Request', error: error.errors });
  }
});

// PUT /api/courses/:id
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      const { title, description, estimatedTime, materialsNeeded, userId } = req.body;

      // Update the course
      await course.update({
        title,
        description,
        estimatedTime,
        materialsNeeded,
        userId,
      });

      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Bad Request', error: error.errors });
  }
});

// DELETE /api/courses/:id
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (course) {
      // Delete the course
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

