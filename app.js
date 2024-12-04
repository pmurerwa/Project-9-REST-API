'use strict';

// load modules
// Import required modules
const express = require('express');
const morgan = require('morgan');
const { Sequelize } = require('sequelize');
const models = require('./models'); // Initialize Sequelize models

const userRoutes = require('./routes/users'); //Qn6 adding Users Route to the Express App!
const courseRoutes = require('./routes/courses'); //Qn7 adding courses Route to the Express App!

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// setup morgan which gives us HTTP request logging
app.use(morgan('dev'));

// Add middleware to parse JSON
app.use(express.json());


// #Qn2.5 Initialize Sequelize instance with SQLite pointing to fsjstd-restapi.db with the sqlite dialect.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
});

// #Qn2.5 test the database connection with async IIFE
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync(); // Synchronize the models with the database
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Use the users and courses routes
app.use('/api/users', userRoutes); //Qn6 adding Users Route to the Express App!
app.use('/api/courses', courseRoutes);  //Qn7 adding courses Route to the Express App!

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
