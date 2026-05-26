# Start with a node base image
FROM node:22-alpine

RUN apk add --no-cache python3 py3-pip make g++
RUN ln -sf /usr/bin/python3 /usr/bin/python

WORKDIR /val

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install production deps only
RUN npm ci --only=production --no-optional

# Copy local directories to the current local directory of /val
COPY src ./src
COPY public ./public

EXPOSE 3000

# Start the app using serve command
CMD ["npm", "start"]