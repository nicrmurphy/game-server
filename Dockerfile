# Use a Node.js base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install project dependencies using pnpm
RUN pnpm install

# Copy the rest of the project files to the container
COPY . .

# Build the project with Vite
RUN pnpm build

# Expose the desired ports
EXPOSE 5000

# Start the application (replace "build" with the appropriate command to start your app)
CMD ["pnpm", "serve"]