# Step 1: Specify the base image
FROM node:alpine

# Step 2: Set the working directory
WORKDIR /app/backend

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy your application code
COPY . /app/backend

# Step 6: Expose the port your app runs on
EXPOSE 3001

# Step 7: Start your application/
CMD ["node", "server.js"]