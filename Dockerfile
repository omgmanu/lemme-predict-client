# Use an official Node.js runtime as a parent image
FROM node:20-alpine as build

# Install Python and build dependencies
RUN apk add --no-cache python3 make g++ linux-headers eudev-dev

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

RUN npm i -g serve

# Copy the rest of your application code to the working directory
COPY . .

# Build the Vite app for production
RUN npm run build

# Set the working directory in the new image
WORKDIR /app

# Copy the build output from the previous stage
# COPY --from=build /app/dist ./dist
COPY . .

# Expose the port the app runs on
EXPOSE ${PORT}

# Start the server
# CMD ["serve", "-s", "dist"]