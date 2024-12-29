# Use the official Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's files
COPY . .

# Expose the port used by the React development server
EXPOSE 3000

# Run the development server
CMD ["npm", "start"]
