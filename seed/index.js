'use strict';

// Import required modules
const promiseFinally = require('promise.prototype.finally');
const Database = require('./database');
const data = require('./data.json');

// Enable logging for database operations based on environment variable
const enableLogging = process.env.DB_ENABLE_LOGGING === 'true';
const database = new Database(data, enableLogging);

// Ensure the final promise handling
promiseFinally.shim();

// Initialize the database and handle any errors
database.init()
  .catch(err => console.error(err))
  .finally(() => process.exit());
