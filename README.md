# TactLink Software Assessment

## Project Overview

A full-stack To-Do application developed for the TactLink Software Engineer assessment.

The repository contains:

- A React Native + Expo mobile application
- A React + Vite web application
- A Node.js + Apollo Server GraphQL backend

Both client applications communicate with the separately hosted GraphQL backend.

## Table of Contents

- [Assessment Requirements](#assessment-requirements)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [System Architecture](#system-architecture)
- [Backend](#backend)
- [Mobile Application](#mobile-application)
- [Web Application](#web-application)
- [GraphQL API](#graphql-api)
- [Authentication](#authentication)
- [Data Storage](#data-storage)
- [Deployment](#deployment)
- [AWS Deployment Plan](#aws-deployment-plan)
- [Technical Decisions](#technical-decisions)
- [Limitations](#limitations)
- [Testing](#testing)
- [Time Taken](#time-taken)
- [Live Demo](#live-demo)
- [Repository](#repository)
- [Conclusion](#conclusion)

## Assessment Requirements

The assessment includes:

1. **Mobile application**
   - React Native and Expo
   - Email/password login
   - To-Do management
   - GraphQL integration
   - React Navigation

2. **Backend**
   - Node.js and GraphQL
   - Dummy login and signup
   - User-scoped To-Do items
   - To-Do CRUD operations
   - Apollo Server

3. **Web application**
   - React
   - Core To-Do functionality
   - GraphQL integration
   - Vercel deployment

4. **Cloud**
   - AWS deployment or an AWS deployment plan

The AWS deployment-plan option was selected for this assessment.

## Features

### Authentication

- User signup
- User login
- Dummy token-based authentication
- User-specific To-Do access

### To-Do Management

- Create To-Dos
- View To-Dos
- Mark To-Dos as completed
- Mark To-Dos as incomplete
- Update To-Dos
- Delete To-Dos

### Mobile Application

- Login screen
- To-Do screen
- React Navigation
- Apollo Client and GraphQL integration

### Web Application

- Signup and login
- To-Do creation and viewing
- Completion and uncompletion
- To-Do deletion
- Logout and login again
- Responsive interface
- Vercel deployment

## Technology Stack

| Area | Technologies |
|---|---|
| Backend | Node.js, JavaScript, Apollo Server, GraphQL |
| Mobile | React Native, Expo, TypeScript, React Navigation, Apollo Client, GraphQL |
| Web | React, Vite, JavaScript, Apollo Client, GraphQL, CSS |
| Current hosting | Render for the backend, Vercel for the web application |

## Project Structure

```text
tactlink-software-assessment/
├── backend/
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
├── mobile/
│   ├── src/
│   │   ├── graphql/
│   │   │   ├── client.ts
│   │   │   └── queries.ts
│   │   ├── navigation/
│   │   │   └── AppNavigator.tsx
│   │   └── screens/
│   │       ├── LoginScreen.tsx
│   │       └── TodoScreen.tsx
│   ├── App.tsx
│   └── package.json
├── web/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── graphql.js
│   │   └── index.css
│   └── package.json
├── AWS_DEPLOYMENT_PLAN.md
├── .gitignore
└── README.md
```

## System Architecture

```text
┌────────────────────────────┐
│ React Native + Expo Mobile │
└──────────────┬─────────────┘
               │ GraphQL
               ▼
┌────────────────────────────┐
│ Node.js + Apollo Server    │
│ GraphQL Backend            │
└──────────────▲─────────────┘
               │ GraphQL
               │
┌──────────────┴─────────────┐
│ React + Vite Web App       │
└────────────────────────────┘
```

## Backend

The backend is implemented with Node.js, Apollo Server, and GraphQL.

### Local Setup

```bash
cd backend
npm install
npm start
```

The backend runs on port `4000` locally by default and supports the `PORT` environment variable for deployment environments.

### Functionality

The backend provides:

- Signup
- Login
- Authentication
- User-scoped To-Do retrieval
- To-Do creation
- To-Do updates
- To-Do deletion

To-Dos contain a `userId`. Authenticated requests are checked against the authenticated user's ID before To-Do operations are performed.

## Mobile Application

The mobile application uses React Native, Expo, TypeScript, React Navigation, Apollo Client, and GraphQL.

### Local Setup

```bash
cd mobile
npm install
npx expo start
```

### Screens

- Login Screen
- To-Do Screen

### Functionality

- Login
- View To-Dos
- Create To-Dos
- Complete To-Dos
- Uncomplete To-Dos
- Delete To-Dos

## Web Application

The web application uses React, Vite, JavaScript, Apollo Client, GraphQL, and CSS.

### Local Setup

```bash
cd web
npm install
npm run dev
```

The GraphQL endpoint is configured with:

```env
VITE_GRAPHQL_URL=https://tactlink-backend.onrender.com
```

The web application supports authentication and the core To-Do workflow through the shared GraphQL backend.

## GraphQL API

### Query

```graphql
todos: [Todo!]!
```

### Mutations

```graphql
signup(email: String!, password: String!): AuthPayload!
login(email: String!, password: String!): AuthPayload!
createTodo(title: String!): Todo!
updateTodo(id: ID!, title: String, completed: Boolean): Todo!
deleteTodo(id: ID!): Boolean!
```

### Get To-Dos

```graphql
query {
  todos {
    id
    title
    completed
    userId
  }
}
```

### Signup

```graphql
mutation {
  signup(email: "user@example.com", password: "password") {
    token
    user {
      id
      email
    }
  }
}
```

### Login

```graphql
mutation {
  login(email: "user@example.com", password: "password") {
    token
    user {
      id
      email
    }
  }
}
```

### Create a To-Do

```graphql
mutation {
  createTodo(title: "Complete assessment") {
    id
    title
    completed
    userId
  }
}
```

### Update a To-Do

```graphql
mutation {
  updateTodo(id: "1", completed: true) {
    id
    title
    completed
  }
}
```

### Delete a To-Do

```graphql
mutation {
  deleteTodo(id: "1")
}
```

## Authentication

Authentication uses a simplified dummy token mechanism.

Successful signup or login returns a token in the following format:

```text
dummy-token-{userId}
```

Clients send the token using:

```http
Authorization: Bearer <token>
```

The backend uses the token to identify the authenticated user and restrict To-Do operations to that user's data.

This mechanism is intentionally simplified for the assessment and is not intended for production use.

## Data Storage

The backend currently uses in-memory JavaScript arrays for users and To-Dos:

```javascript
const users = [];
const todos = [];
```

As a result:

- Data is not persistent.
- Data is lost when the backend restarts.
- Passwords are stored in memory and are not hashed.
- A persistent database would be required for production.

DynamoDB is proposed as the persistence layer in the AWS deployment plan.

## Deployment

### Backend

The GraphQL backend is deployed on Render:

```text
https://tactlink-backend.onrender.com
```

Render configuration:

- Root directory: `backend`
- Build command: `npm install`
- Start command: `node src/index.js`

### Web Application

The web application is deployed on Vercel:

```text
https://tactlink-software-assessment-8cud6b8qq-husna.vercel.app
```

Vercel configuration:

- Framework: Vite
- Root directory: `web`
- Build command: `npm run build`
- Output directory: `dist`

AWS deployment was not performed.

## AWS Deployment Plan

The assessment permits either an AWS deployment or a deployment plan. The deployment-plan option was selected.

The following is a proposed future architecture and does not represent the current hosting arrangement.

```text
Mobile / Web Application
          |
        HTTPS
          ▼
    API Gateway
          ▼
      Lambda
  Node.js GraphQL API
          ▼
     DynamoDB

IAM: permissions and access control
CloudWatch: logging and monitoring
```

### Proposed Deployment Flow

1. Adapt the Node.js GraphQL backend for AWS Lambda.
2. Create DynamoDB tables for users and To-Dos.
3. Configure the Lambda IAM role.
4. Deploy the GraphQL backend to Lambda.
5. Create an API Gateway HTTP API.
6. Connect API Gateway to Lambda.
7. Configure the mobile and web applications to use the API Gateway URL.
8. Monitor the service with CloudWatch.

## AWS Architecture

### Amazon API Gateway

Provides a public HTTPS endpoint for the GraphQL API and forwards requests to Lambda.

### AWS Lambda

Runs the Node.js GraphQL backend using serverless execution.

### Amazon DynamoDB

Provides persistent storage for users and To-Dos, replacing the current in-memory storage.

### AWS IAM

Provides permissions and access control. The Lambda function should receive only the permissions it requires.

### Amazon CloudWatch

Provides Lambda logs, error monitoring, troubleshooting information, and operational monitoring.

## Estimated AWS Cost

The following is an estimate for a small assessment or demonstration workload:

| AWS Service | Estimated Cost |
|---|---:|
| API Gateway | Approximately $0 within applicable free-tier allowance |
| AWS Lambda | Approximately $0 within applicable free-tier allowance |
| DynamoDB | Approximately $0 for a small workload within applicable free-tier allowance |
| CloudWatch | Low, usage-dependent cost |
| IAM | No additional service charge |
| **Estimated total** | **Approximately $0–$5/month** |

Actual cost depends on:

- AWS region
- Account eligibility
- Request volume
- Lambda execution time
- DynamoDB usage
- CloudWatch log volume
- Data transfer

This project is not currently running on AWS.

## Technical Decisions

- **GraphQL:** Used as the shared API between the mobile application, web application, and backend.
- **Apollo Server:** Used to implement the Node.js GraphQL backend.
- **Apollo Client:** Used by both client applications to communicate with the GraphQL backend.
- **React Navigation:** Used for navigation between mobile screens.
- **In-memory storage:** Keeps the assessment implementation lightweight and focused on the required functionality. A persistent database would be used in production.

## Limitations

- Authentication uses a dummy token mechanism.
- Passwords are stored in memory and are not hashed.
- Users and To-Dos are stored in memory.
- Data is lost when the backend restarts.
- AWS deployment was not performed.
- The AWS architecture is a proposed deployment plan.
- Offline or local caching was not implemented.

## Testing

The following functionality was tested.

### Backend

- Signup
- Login
- Authentication
- User-scoped To-Do retrieval
- Create To-Do
- Update To-Do
- Complete To-Do
- Uncomplete To-Do
- Delete To-Do

### Web

- Signup
- Login
- Create To-Do
- View To-Dos
- Complete To-Do
- Uncomplete To-Do
- Delete To-Do
- Logout
- Login again
- Connection to the deployed GraphQL backend

### Mobile

- Login
- GraphQL connection
- To-Do retrieval
- Create To-Do
- Complete To-Do
- Uncomplete To-Do
- Delete To-Do

## Time Taken

Approximately **2.5 hours total**, including implementation, debugging, testing, deployment, and documentation.

## Live Demo

**Web application:**  
https://tactlink-software-assessment-8cud6b8qq-husna.vercel.app

**GraphQL backend:**  
https://tactlink-backend.onrender.com

## GitHub Repository

https://github.com/ZhsnNblh/tactlink-software-assessment

## Conclusion

This repository contains the completed TactLink Software Engineer assessment, including a React Native mobile application, React web application, shared GraphQL backend, current Render and Vercel deployments, and a proposed AWS deployment architecture.