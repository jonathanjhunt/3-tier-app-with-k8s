# Build Stage
FROM node:alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Ensure npm scripts have correct permissions
RUN chmod +x /app/node_modules/.bin/* && npm run build

# Serve Stage
FROM nginx:alpine
COPY .nginx/nginx.conf /etc/nginx/nginx.conf
## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]