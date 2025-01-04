# Step 1: Use a Node.js image for building the React app
FROM node:20 as build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json /app/

# Step 4: Install project dependencies
RUN npm install

# Step 5: Copy the entire project to the container
COPY . /app/

# Step 6: Build the React app for production
RUN npm run build

# Step 7: Use an Nginx image to serve the built files
FROM nginx:alpine

# Step 8: Copy the build output to Nginx's HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose the default Nginx port
EXPOSE 80

# Step 10: Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]
