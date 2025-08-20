# =========================================================================
# Stage 1: Build the Frontend
# =========================================================================
# Use a Node image to get build tools. Name this stage 'builder'.
FROM node:18-alpine AS builder

# Set the working directory for the frontend build
WORKDIR /app/frontend

# Copy only the package files first to leverage Docker's cache
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend source code
COPY frontend/ ./

# Run the build script to generate static files in the /build folder
RUN npm run build


# =========================================================================
# Stage 2: Setup the Backend & Create the Final Image
# =========================================================================
# Start from a fresh, lightweight Node image for the final app
FROM node:18-alpine

# Set the working directory for the backend
WORKDIR /app

# Copy the backend's package files
COPY backend/package*.json ./
# Install *only* production dependencies to keep the image small
RUN npm install --production

# Copy the backend source code
COPY backend/ ./

# --- The Key Step ---
# Copy the built frontend assets from the 'builder' stage
# This copies the contents of /app/frontend/build into /app/public
# This is the corrected line
COPY --from=builder /app/frontend/dist ./public

# Expose the port your backend server runs on
EXPOSE 5000

# Command to start your backend server
# This is the corrected line
CMD [ "node", "server.js" ]