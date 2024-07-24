# Build Stage
FROM node:16 AS build-stage
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean the npm cache and install dependencies
RUN npm cache clean --force
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure all binaries in node_modules/.bin are executable
RUN chmod -R +x /app/node_modules/.bin

# Debugging: List contents of /app/node_modules/.bin
RUN ls -l /app/node_modules/.bin

# Run build script
RUN npm run build

# Serve Stage
FROM nginx:alpine
COPY .nginx/nginx.conf /etc/nginx/nginx.conf

# Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to nginx html directory
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]