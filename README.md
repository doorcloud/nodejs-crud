# Launching a [Node JS](https://nodejs.org) (JavaScript) Application and Databases [Postgres](https://www.postgresql.org) [Mysql](https://www.mysql.com) [Maria DB](https://mariadb.org/) with Docker

This guide explains how to set up and launch a [Node JS](https://nodejs.org) (JavaScript) application with [Express JS](https://expressjs.com) using Docker.

## Prerequisites

Before starting, ensure you have the following tools installed on your machine:

- [Docker](https://www.docker.com/products/docker-desktop)

## Dockerfile Content

This Dockerfile configures a container for a [Node JS](https://nodejs.org) (JavaScript) application with [Express JS](https://expressjs.com).

```Dockerfile
# Step 1: Build the base image
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy configuration files
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Step 2: Expose the application port
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]

```
## Steps to Launch the Application

1. Build the Docker Image

To build the Docker image, use the following command in the directory containing the Dockerfile:

```
docker build -t nodejs-crud .
```

2. Run the Container

Once the image is built, run a container from this image:

```
docker run -p 3000:3000 nodejs-crud
```

3. Access the Application

Open your browser and go to the following URL to see your application running:

```
http://localhost:3000
```

4. Environment Variables

If you need to configure additional environment variables, add these on the system.

```
NODE_ENV=development
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=db_door
DB_HOST=127.0.0.1
DB_DIALECT=postgres # 'mysql' | 'postgres' | 'mariadb'
```

4. Migration the database structure
```
npx sequelize-cli db:migrate
```

## Publishing the Image on Docker Hub

1. Log In to Docker Hub

Before publishing your image, log in to Docker Hub with your Docker account:

```
docker login
```

2. Tag the Image

Tag the image you built with your Docker Hub username and the image name:

```
docker tag nodejs-crud your_dockerhub_username/nodejs-crud:latest
```
Replace your_dockerhub_username with your Docker Hub username.

3. Push the Image to Docker Hub

Push the tagged image to Docker Hub:

```
docker push your_dockerhub_username/nodejs-crud:latest
```