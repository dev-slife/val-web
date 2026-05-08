### System Requirements

Before you begin the setup, ensure that your system has the following prerequisites:

Node.js: This is required to run the server-side application. Install the latest LTS version of Node.js from the official website
.
Docker: Docker is essential for running the web app in a containerized environment. If you don’t have Docker installed, you can download it from the Docker website
.
MongoDB: MongoDB is used for storing user data and conversation logs. Ensure you have MongoDB installed locally or have access to a MongoDB service. You can download MongoDB from here
.
MinIO: This is a high-performance object storage service used for storing files such as images or documents. MinIO should also be set up either locally or in the cloud. Download MinIO from here
.
### Setting Up the Web App

Clone the repository:
First, you need to clone the web app repository to your local machine using Git.

git clone https://github.com/your-username/VAL.git
cd VAL

Install dependencies:
The web app uses Node.js, so after navigating to the project directory, you’ll need to install all the required dependencies using npm.

npm install

Set up Docker:
The application should be run inside a Docker container to simplify deployment. To do this, make sure you have Docker installed, then use the following steps:

Create a Dockerfile in the root directory if not already present:

FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]

Build the Docker container:

docker build -t val-app .

Run the container:

docker run -p 3000:3000 val-app

This will expose the web app on port 3000. You can access it by visiting http://localhost:3000 in your browser.

### Configuring the Web App to Work with MongoDB and MinIO

The VAL web app relies on MongoDB and MinIO for data storage and object storage respectively. Here's how to configure them:

### MongoDB Configuration
Install MongoDB (if not using a cloud service):
Follow the instructions on the MongoDB website
 to install MongoDB on your local machine.

Configure MongoDB connection:
In the src/config.js file, configure the MongoDB connection URL. For example, if MongoDB is running locally on the default port, the URL might look like this:

const mongoDBUrl = 'mongodb://localhost:27017/val_db';

If you are using a cloud service like MongoDB Atlas, use the connection string provided by your service.

Start MongoDB:
Ensure MongoDB is running before starting the application. If you're running it locally, use the following command:

mongod

If using a cloud service, ensure the connection string is valid and MongoDB is accessible.

### MinIO Configuration
Install MinIO (if not using a cloud service):
Download and install MinIO from the official site: MinIO
.

Configure MinIO:
In the src/config.js file, set the appropriate values for MinIO's endpoint, access key, and secret key. Here’s an example configuration:

const minioConfig = {
  endpoint: 'localhost',
  port: 9000,
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key',
  useSSL: false
};

Start MinIO:
You can start MinIO locally using the following command:

minio server /data

This will start MinIO on port 9000. You can access it via http://localhost:9000. You’ll need to use the MinIO client or dashboard to create the necessary buckets for storage.

### Important Functions in VAL Web App

The web app is structured around several key functions that work together to provide a seamless experience for users. Below are the core components of the app, described in detail:

### Handling User Accounts (/api/credentials)

This endpoint is responsible for managing user authentication and credentials. It supports the following actions:

Sign Up: Users can create an account by providing their details (email, password).
Login: Users can log in to access their personalized experience and save their previous conversations.
Session Management: The app uses JWT (JSON Web Tokens) for session management to ensure that only authenticated users can access certain features.
### Algebra Processing and VAL Functions (/api/vast)

This is the core functionality of the web app. The /api/vast endpoint handles:

Equation Parsing: When a user inputs an algebraic problem, the server parses the equation.
Step-by-Step Solutions: VAL processes the equation using a set of algorithms and returns a step-by-step breakdown.
Math Algorithms: VAL utilizes various algebraic algorithms, such as solving linear equations, quadratic equations, factorization, etc., to help users understand the concepts.
### Conversation or File Storage (/api/storage)

This endpoint manages the storage of conversations and other files:

Storing Conversations: If a user enables conversation history, their past queries and responses will be stored in MongoDB.
File Management: The app allows users to upload and store files (such as math documents, images, etc.) using MinIO. These files are stored in a specified bucket, allowing easy access and retrieval.
### Using the Web App

After setting up the system, here’s how to use the app:

Access the Web App: Open a browser and go to http://localhost:3000. You should see the home page.
Create an Account or Log In: If you don’t have an account, sign up. If you have an account, log in to start using VAL.
Ask VAL a Question: Once logged in, you can ask algebra-related questions. VAL will break down the problem and guide you through the solution.
Manage Conversations: If you have enabled conversation history, you can view past interactions under the “Conversations” section.
### Running the App

Once all configurations are complete, you can start the application with:

npm start

This will start the web server, and you should be able to access the app at http://localhost:3000.