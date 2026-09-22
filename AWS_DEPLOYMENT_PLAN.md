# AWS Deployment Plan

## Overview

The GraphQL backend is currently deployed on Render for the assessment demonstration.

As an alternative to deploying the backend directly to AWS, this document describes the proposed AWS deployment architecture for a production environment.

## Architecture

```text
Mobile App
React Native + Expo
        │
        │ HTTPS
        ▼
Web App
React + Vite
        │
        │ HTTPS
        ▼
┌─────────────────────┐
│    API Gateway      │
│      HTTP API       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     AWS Lambda      │
│ Node.js + GraphQL   │
│      / Apollo       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│      DynamoDB       │
│  Users + Todo Data  │
└─────────────────────┘

      ┌───────────────┐
      │  CloudWatch   │
      │ Logs/Monitor  │
      └───────────────┘

      ┌───────────────┐
      │      IAM      │
      │  Permissions  │
      └───────────────┘

## AWS Services

### 1. Amazon API Gateway

API Gateway would provide the public HTTPS endpoint for the GraphQL API and forward incoming requests to the Lambda function.

### 2. AWS Lambda

The existing Node.js GraphQL backend would be adapted to run as a Lambda function.

This removes the need to maintain a continuously running server and allows the backend to scale according to incoming requests.

### 3. Amazon DynamoDB

DynamoDB would replace the current in-memory arrays used by the assessment backend.

The database would store:

- User accounts
- Todo items
- User-to-todo relationships

This would provide persistent storage when the Lambda function is restarted.

### 4. AWS IAM

IAM would be used to provide the Lambda function with only the permissions required to access the DynamoDB tables and other required AWS resources.

### 5. Amazon CloudWatch

CloudWatch would be used for:

- Lambda execution logs
- Error monitoring
- Basic application troubleshooting
- Operational monitoring

## Deployment Flow

1. Adapt the existing Node.js GraphQL backend for AWS Lambda.
2. Create DynamoDB tables for users and todo items.
3. Configure an IAM role for the Lambda function.
4. Deploy the GraphQL backend as an AWS Lambda function.
5. Create an API Gateway HTTP API endpoint.
6. Connect API Gateway to the Lambda function.
7. Configure the mobile and web applications to use the API Gateway URL.
8. Use CloudWatch to monitor Lambda execution and application errors.

## Estimated Cost

For a small assessment/demo workload, the estimated monthly cost is approximately:

| AWS Service | Estimated Cost |
|---|---:|
| API Gateway | ~$0 within applicable free-tier allowance |
| AWS Lambda | ~$0 within applicable free-tier allowance |
| DynamoDB | ~$0 for a small workload within applicable free-tier allowance |
| CloudWatch | Low usage-dependent cost |
| IAM | No additional service charge |
| **Estimated Total** | **Approximately $0–$5/month** |

The actual cost depends on AWS region, account eligibility, request volume, Lambda execution time, database usage, logging, and data transfer.

## Current Deployment vs Proposed AWS Deployment

The assessment application is currently deployed as follows:

- Web application: Vercel
- GraphQL backend: Render
- Mobile application: React Native + Expo

AWS deployment was not performed for this assessment. The architecture above is the proposed AWS deployment plan, using the alternative option specified in the assessment.

## Benefits of the Proposed Architecture

- Serverless backend infrastructure
- Reduced server maintenance
- Automatic scaling based on demand
- Persistent database storage using DynamoDB
- Centralized logging through CloudWatch
- IAM-based access control