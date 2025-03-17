# Dockerfile

# 1. Use a lightweight Node.js image
FROM node:18-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package and lock files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the project
COPY . .

# 6. Build the Next.js application
RUN npm run build

# 7. Expose the port
EXPOSE 3000

# 8. Start the app
CMD ["npm", "run", "start"]