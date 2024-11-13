# Step 1: Build the base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy configuration files
COPY package.json ./

RUN npm install --save @opentelemetry/api

RUN npm install --save @opentelemetry/auto-instrumentations-node

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Step 2: Expose the application port
EXPOSE 3000

# Command to start the application
CMD ["npm", "--require @opentelemetry/auto-instrumentations-node/register", "start"]

# npx sequelize-cli db:migrate
