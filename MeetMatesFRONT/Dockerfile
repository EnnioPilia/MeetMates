# ------------------------------------------------------------
# Stage 1: Build the Angular app with Node
# ------------------------------------------------------------
FROM node:22-alpine AS build

# Working directory inside the container
WORKDIR /app

# Install dependencies using a clean, reproducible method
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the Angular source code
COPY . .

# Build the Angular app in production mode (SSR/prerender included)
# If you ever change your build script name, adapt this line.
RUN npm run build -- --configuration=production

# ------------------------------------------------------------
# Stage 2: Serve the built app with Nginx
# ------------------------------------------------------------
FROM nginx:alpine AS runtime

# Remove default nginx site config
RUN rm /etc/nginx/conf.d/default.conf

# Use our custom SPA-friendly nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean the default nginx web root
RUN rm -rf /usr/share/nginx/html/*

# IMPORTANT:
# Copy ONLY the Angular browser build output to the nginx web root.
# Default Angular output structure:
# /app/dist/<project-name>/browser
# Here we assume project name = "MeetMates"
COPY --from=build /app/dist/meetmates/browser/ /usr/share/nginx/html/

EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
