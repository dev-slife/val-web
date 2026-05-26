# Virtual Arithmetic Luminary

VAL otherwise known as your Virtual Arithmetic Luminary, is a chatbot here to help you learn and better understand algebraic concepts!


## VAL as a Tool

### A Helpful Tutorbot

VAL is a tutor chatbot here to act as your mathemetical guide. If you're struggling to understand certain algebra concepts or are having difficulty solving an equation, you can ask VAL for help. As a math luminary, VAL will break down your problem into smaller chunks and walk you through the problem solving process. The goal is not to have VAL just give you answers, but to help you understand how to tackle algebraic problems.

In order to ask VAL questions, you have to head to a web app which is hosted on a [Docker container](https://www.docker.com/). From there you can navigate to the designated space for conversation with the chatbot. All questions given to VAL are handled directly through the backend. After some thinking, VAL will generate a response and walk you through the problem step by step. Past conversations will only be stored after the user enables the setting for their account and can be deleted at anytime.

> [!IMPORTANT]
> VAL is a WIP and currently does not have some features such as chat history.


### Algorithms, NOT AI

It's important to note that VAL is not an AI chatbot like other well known LLMs. Instead, VAL uses multiple different algorithms in order to solve math equations and know how to respond to certain inputs. This means that:

1. Accuracy is 100%, if a mistake is made there is a bug in the code itself
2. Responses from VAL may not be as in depth or articulate as most other LLMs
3. VAL does not remember context or previous conversations like most other LLMs do
4. VAL can only help you with algebra, it's not programmed for other topics
5. NO DATA IS COLLECTED FOR TRAINING


## VAL as a Service

### Server Overview

The backend uses multiple different scripts and libraries to help run the web app with the main file being [`index.js`](../src/index.js).

The application uses the [Express.js](https://expressjs.com/en/) framework to serve pages and handle API requests.

#### Page Routes
- Home (`/`)
- About (`/about`)
- TOS (`/terms`)
- Privacy Policy (`/privacy`)
- Copyright (`/copyright`)

#### API Routes
- User Accounts (`/api/credentials`)
- Math (`/api/vast`) 
- Object Storage (`/api/storage`)

### Running the App

To run the web app alone, you can use these commands to install every dependency and start the service.

```bash
npm install
npm start
```

This should expose the web app on port 3000 and you should be able to visit the home page with this link: http://localhost:3000

If you want to use account features and save information, you will need to prepare a docker environment to run the web app along with MongoDB and MinIO. Information for setting up this environment and more can be found in the [developer manual](./MANUAL.md).