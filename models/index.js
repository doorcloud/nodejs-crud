"use strict";

// Import required modules
const fs = require("fs"); 
const path = require("path"); 
const Sequelize = require("sequelize");
const process = require("process");
require("dotenv").config();

// Get the base name of the current file (this file)
const basename = path.basename(__filename);

// Determine the environment (development, test, production) or default to 'development'
const env = process.env.NODE_ENV || "development";

// Load the database configuration based on the current environment
const config = require(__dirname + "/../config/config.js")[env];

// Create an empty object to hold the database models
const db = {};

// Initialize the Sequelize instance based on environment variables or configuration file
let sequelize;
if (config.use_env_variable) {
  // Use the environment variable for database connection
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Use the parameters from the config file
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Read all files in the current directory and load them as models
fs.readdirSync(__dirname) // Read the directory of this file
  .filter((file) => {
    // Filter files to exclude the current file and non-JS files
    return (
      file.indexOf(".") !== 0 && // Exclude hidden files (starting with .)
      file !== basename && // Exclude the current file
      file.slice(-3) === ".js" && // Only include JS files
      file.indexOf(".test.js") === -1 // Exclude test files
    );
  })
  .forEach((file) => {
    // Import each model and associate it with the Sequelize instance
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model; // Store the model in the db object
  });

// Iterate over the models to set up associations if any exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Call the associate method if defined
  }
});

// Attach the sequelize instance and Sequelize class to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the db object containing all models and sequelize instance
module.exports = db;
