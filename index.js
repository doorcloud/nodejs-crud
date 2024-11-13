require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const { User } = require("./models");
const cors = require("cors");
const morgan = require("morgan"); // Import morgan for logging
const winston = require("winston"); // Import winston for logging
const axios = require("axios"); // Import winston for logging

// Create a logger instance with winston
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(), // Use simple format for console logging
  transports: [
    new winston.transports.Console(), // Log messages to console
  ],
});

// Create the Express app
const app = express();

// Use cors with default options
app.use(cors());

// Use morgan to log HTTP requests
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use(bodyParser.json());

// Route to display "Hello API" on the root
app.get("/", (req, res) => {
  res.send("Hello I'm the Node JS API deployed with Cloudoor");
});

// Get roles from another micr service
app.get("/roles", async (req, res) => {
  try {
    const response = await axios.get(process.env.MS_API_URL+"/roles");
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Create a user
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    logger.info(`User created: ${JSON.stringify(user)}`); // Log user creation
    res.status(201).json(user);
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`); // Log error
    res.status(400).json({ error: error.message });
  }
});

// Read all users
app.get("/users", async (req, res) => {
  try {
    let query = "";
    if (req.query.error) {
      query += "&error=" + req.query.error;
    }

    if (req.query.latence) {
      query += "&latence=" + req.query.latence;
    }

    let users = await User.findAll();

    for (let index = 0; index < users.length; index++) {
      const user = users[index];

      const response = await axios.get(
        process.env.MS_API_URL + "/roles?id=" + user.id + query
      );

      if (response.status === 200) {
        const data = response.data;
        users[index].dataValues.role = data;
      } else {
        res.status(500).json({ error: "Role service unavailable" });
      }
    }

    logger.info(`Fetched ${users.length} users`); // Log number of users fetched
    res.json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`); // Log error
    res.status(500).json({ error: error.message });
  }
});

// Read a specific user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      logger.info(`Fetched user: ${JSON.stringify(user)}`); // Log user details
      res.json(user);
    } else {
      logger.warn(`User not found: ${req.params.id}`); // Log warning
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    logger.error(`Error fetching user: ${error.message}`); // Log error
    res.status(500).json({ error: error.message });
  }
});

// Update a user
app.put("/users/:id", async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedUser = await User.findByPk(req.params.id);
      logger.info(`User updated: ${JSON.stringify(updatedUser)}`); // Log user update
      res.json(updatedUser);
    } else {
      logger.warn(`User not found for update: ${req.params.id}`); // Log warning
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`); // Log error
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      logger.info(`User deleted: ${req.params.id}`); // Log user deletion
      res.status(204).send();
    } else {
      logger.warn(`User not found for deletion: ${req.params.id}`); // Log warning
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`); // Log error
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`); // Log server start
});
