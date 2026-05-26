# Developer Manual

There are a lot of different systems and programs used to help make VAL possible. To help understand the overwhelming amount of components included in this repository, we made a manual which you can refer to when working on your own projects.

## VAL Basics

### System Requirements

Before you start anything, make sure that your system has the following prerequisites:

[⚡Node.js](https://nodejs.org/en): A runtime environment used to run JavaScript programs. This is required for installing dependencies and running your web application. You can install the latest version of Node from their official website.

> [!IMPORTANT]
> Make sure to install Node.js with the `npm` package system.

[🐳Docker](https://www.docker.com/): A popular container system used to help you run the environment for your web app. It's important to install this tool, so you can easily build a virtual network and manage all of your systems. You can download Docker from the official website.

[🚂Express.js](https://expressjs.com/en/): A minimal and flexible node framework used to help create a backend for web applications. You may use other backends if preferred, but keep in mind that you may need to take different approaches that aren't discussed in this manual.

[🍃MongoDB](https://www.mongodb.com/): A NoSQL database used to store unstructured data such as conversation history and system logs. Ensure the MongoDB [image](https://hub.docker.com/_/mongo) gets properly installed locally when building docker containers or you have access to their online service. Also make sure you have the `npm` package for API communication.

[🔒bcrypt](https://www.npmjs.com/package/bcryptjs): A well known hashing package used to help keep passwords protected. It is **crucial** to have a proper hashing system, however if you have another preferred library feel free to use it. For proper password hashing, use an algorithm that follows the [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) standard.

[🦩MinIO](https://www.min.io/): This is a high performance object storage service used for storing files such as images or documents. MinIO should also be automatically set up locally when building your docker containers. Make sure you have the `npm` package installed as well.

[📂Multer](https://www.npmjs.com/package/multer): A middleware for handling file uploads to the backend. This package is used to help users upload profile pictures to the web app.

> [!TIP]
> You can run `npm install` to quickly install every dependency included in [package.json](../package.json).


### Setting Up the Web App

To create your own web app, first clone the repository to your local machine using [Git](https://git-scm.com/).

```bash
git clone https://github.com/dev-slife/val-web.git
```

#### Building Docker Containers
A `Dockerfile` and `docker-compose` file are already made in the [docker directory](../docker/) to handle building the images and running each container. To properly build each container, create a `.env` file in the docker folder and include the following variables:
* APP_IMAGE
  * The container image name and tag to be optionally pulled from your docker repo
  * ex: devslife/image:latest
    * devslife = username
    * image = image name
    * latest = grabs the latest tag
* HOST_PORT
  * The port to expose on the host machine when building the web app image
  * ex: 3000
* APP_PORT
  * The port to expose on the web app
  * ex: 3000
* DB_USER
  * The admin username for MongoDB
  * ex: admin
* DB_PASS
  * The password to access the database
  * ex: password123
* DB_BASICAUTH_USER
  * The username for mongo express (database console)
  * ex: admin
* DB_BASICAUTH_PASS
  * The password for mongo express
  * ex: password123
* MINIO_USER
  * The username for MinIO
  * ex: admin
* MINIO_PASS
  * The password for managing MinIO's data
  * ex: password123
* MINIO_ENDPOINT
  * The public endpoint to reach your MinIO server
  * ex: host.docker.internal
  * For Windows machines use the above example, Linux can use `localhost` or `127.0.0.1`

After installing Docker, open your terminal and type the following commands to build your images and run the containers on your local machine:

```bash
cd val-web/docker # change to the path your docker folder resides in
docker compose up
```

This will expose the web app on `HOST_PORT`. You can access it by visiting `http://localhost:$HOST_PORT` in your browser (change `$HOST_PORT` with the actual number).

> [!TIP]
> You can add the flag `-d` to the `docker compose` command for "detached mode" to prevent the CLI from being taken over by your container's logs.


### Noteable Functions

The web app is structured around several key functions which are explained below. All API routes fall under the `/api` subdomain.

#### Account Management

**Endpoint**: `/api/credentials`

This endpoint is responsible for managing user authentication and credentials. It supports the following actions:

* Register
  * Users can create an account by providing their details
  * Endpoint: `/register`
  * Returns:
    * status 200, 500, or 400
    * success - could the user successfully register
    * registered - whether the user is/was registered
    * user - the user to register
    * msg - a message explaining the output
* Login
  * Users can log in to access and update their personalized experience
  * Endpoint: `/login`
  * Returns the same variables as register
* Session Management
  * The web app currently uses session storage as a temporary authentication to keep users logged in
  * This will change in the future for better security as the app continues to be worked on

> [!IMPORTANT]
> All information is handled via the backend and all passwords are hashed before being sent to the database.


#### VAST

**Endpoint**: `/api/vast`

This endpoint is used to run VAST computations and solve math equations.

* Simplifying
  * For quick math simplification
  * Endpoint: `/simplify`
  * Returns:
    * status 200, 400, or 500
    * an error message or the answer
* Solving
  * For solving math equations
  * Endpoint: `/solve`
  * Returns the same variables as simplify
* Asking Questions
  * You can directly ask questions to VAL as if you are talking with another human being
  * Endpoint: `/ask`
  * Returns:
    * status 200, 400, or 500
    * answer - the solution to the given problem
    * log - the steps to reach the answer
    * slm - the generated messages

> [!NOTE]
> VAL processes equations using a set of algorithms and returns a JSON containing the solution, the steps for reaching the answer, and generated messages.

#### Object Storage

**Endpoint**: `/api/storage`

This endpoint is used to communicate with MinIO and store images.

* Uploading PFPs
  * Users can upload profile pictures to customize their account
  * Endpoint: `/pfp/upload`
  * Returns:
    * status 200, 400, or 500
    * msg - the server message
    * url - the blob storage url of the uploaded image
* Grabbing PFPs
  * Users need to be able to see their pfps on the web app, so this endpoint is used to grab a working link to the image
  * Endpoint: `pfp/pull`
  * Returns the same variables as upload
* Grabbing VAL's Images
  * This is used to pull general images stored for the web app
  * Endpoint: `blob/pull`
  * Returns the same variables as upload


### Running the App by Itself

If you wish to quickly test the web app alone without using account features, you can run the following command in your VSCode terminal:

```bash
npm start
```

This will start the web server and you should be able to access the app at http://localhost:3000.

> [!WARNING]
> Testing the web app alone may break certain parts of the app, since some components rely on MongoDB and MinIO.


## VAL's Simple Language Model

*-- more will be added--*