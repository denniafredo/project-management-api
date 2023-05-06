# Project Name
This project is called "Project Management API" and is designed to provide a RESTful interface for managing user accounts, projects and tasks.

# API Description
The API provides RESTful API built using Node.js and Express.js. It provides endpoints for managing users, projects, and tasks. The data is stored in a MongoDB database and is accessed using Mongoose. Authentication is done using JSON Web Tokens (JWT) and authorization is implemented to ensure that users can only access their own data. The API also includes error handling, security measures, and documentation to ensure that it is easy to use and secure.

# Endpoints
## AUTHENTICATION 
| Method    |  Endpoint   | Description               |
|:----------|:------------|:--------------------------|
| **POST**  | _/register_ | Register new user account |
| **POST**  | _/login_    | Login user accounts       |

## USER
| Method      |  Endpoint    | Description                          |
|:------------|:-------------|:-------------------------------------|
| **POST**    | _/users_     | Create a new user account            |
| **GET**     | _/users_     | Get a list of all user accounts      |
| **GET**     | _/users/:id_ | Get a specific user account by ID    |
| **PUT**     | _/users/:id_ | Update a specific user account by ID |
| **DELETE**  | _/users_     | Delete a specific user account by ID |

## PROJECT
| Method      |  Endpoint             | Description                                 |
|:------------|:----------------------|:--------------------------------------------|
| **POST**    | _/projects_           | Create a new project                        |
| **GET**     | _/projects_           | Get a list of all user's projects           |
| **GET**     | _/projects/:id_       | Get a specific user's project by ID         |
| **GET**     | _/projects/tasks/:id_ | Get a specific user's project by task ID    |
| **PUT**     | _/projects/:id_       | Update a specific user's project by ID      |
| **DELETE**  | _/projects_           | Delete a specific user's project by ID      |

## TASKS
| Method      |  Endpoint    | Description                          |
|:------------|:-------------|:-------------------------------------|
| **POST**    | _/tasks_     | Create a new task                    |
| **GET**     | _/tasks_     | Get a list of all user's tasks      |
| **GET**     | _/tasks/:id_ | Get a specific user's task by ID    |
| **PUT**     | _/tasks/:id_ | Update a specific user's task by ID |
| **DELETE**  | _/tasks_     | Delete a specific user's task by ID |

# Authentication
The API uses JSON Web Tokens (JWT) for authentication. When a user logs in or registers, the API returns a JWT that is used to authenticate subsequent requests. The JWT is passed in the header of each request using the bearer token scheme.
Include the JWT token in the Authorization header of subsequent requests with the following format:

Authorization: Bearer <token>

# Authorization
The API includes authorization to ensure that users can only access their own data. Users can access and modify their own data only through their projects and tasks.

# Error Handling
The API returns JSON responses for errors, with a 422 status code for validation errors and a 500 status code for server errors and some custom error handling.

# Security
The API uses JWT tokens for authentication and requires HTTPS for all requests.

# Documentation
The API documentation is available in the documentation folder of the repository, in postman format, all of the request body and response body format is already given. [ interaktiv.postman_collection.json ]
Import and then Open the view documentation on ... after collections

# Deployment
The API is deployed to a Vercel server.

# API Documentation
The full API documentation can be found in the documentation/interaktiv.postman_collection.json file of the repository.

# Link to Deployed API
https://project-management-api-lemon.vercel.app