# cognito-poc

## Overview

This project serves as a proof-of-concept for integrating Amazon Cognito for user authentication. It includes routes for user authentication, registration, email verification, and token management.

## Routes

### Authentication Routes

#### POST /auth
- Endpoint for user login.
- Requires a valid username and password in the request body.
- Returns user authentication tokens upon successful login.

#### POST /auth/refresh
- Endpoint for token renewal.
- Requires a valid access token in the request headers.
- Returns refreshed authentication tokens.

### User Routes

#### POST /user
- Endpoint for user registration.
- Requires user details like username, password, name, gender, and email in the request body.
- Returns the result of the registration process.

#### PUT /user
- Endpoint for updating user details.
- Requires a valid access token in the request headers and user details in the request body.
- Returns the result of the update process.

#### POST /user/verify-email
- Endpoint for verifying a user's email address.
- Requires the username and verification code in the request body.
- Returns the result of the email verification process.

#### POST /user/resend-code
- Endpoint for resending the confirmation code.
- Requires the username in the request body.
- Returns the result of the code resend process.

## Usage

To use these routes, make sure you have the necessary environment variables set up. You can refer to the `.env.sample` file for required variables.

### Installation

```bash
# Install dependencies
npm install
