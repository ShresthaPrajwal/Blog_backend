// userDocs.js

const userDocs = {
  openapi: '3.0.0',
  info: {
    title: 'User Management API',
    version: '1.0.0',
    description: 'API for managing users',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'User management',
    },
  ],
  paths: {
    '/users': {
      post: {
        summary: 'Register a new user',
        tags: ['Users'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  username: {
                    type: 'string',
                    example: 'john_doe',
                  },
                  name: {
                    type: 'string',
                    example: 'John Doe',
                  },
                  password: {
                    type: 'string',
                    example: 'password123',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User created successfully',
          },
          400: {
            description: 'Bad request',
          },
        },
      },
      get: {
        summary: 'Get user details',
        tags: ['Users'],
        responses: {
          200: {
            description: 'User details',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      username: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                      passwordHash: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'User not found',
          },
        },
      },
    },
    '/users/{username}': {
      put: {
        summary: 'Update user information',
        tags: ['Users'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'username',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'Username to update',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                  },
                  password: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'User updated successfully',
          },
          400: {
            description: 'Bad request',
          },
          404: {
            description: 'User not found',
          },
        },
      },
      delete: {
        summary: 'Delete a user',
        tags: ['Users'],
        security: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            in: 'path',
            name: 'username',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'Username to delete',
          },
        ],
        responses: {
          200: {
            description: 'User deleted successfully',
          },
          404: {
            description: 'User not found',
          },
        },
      },
    },
  },
};

module.exports = userDocs;
