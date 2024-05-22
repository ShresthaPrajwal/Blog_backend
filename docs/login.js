
const loginDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Example API',
    version: '1.0.0',
    description: 'This is a simple example API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication management',
    },
  ],
  paths: {
    '/login': {
      post: {
        summary: 'Login to the system',
        tags: ['Authentication'],
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
          200: {
            description: 'Successful login',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: {
                      type: 'string',
                      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                    },
                    username: {
                      type: 'string',
                      example: 'john_doe',
                    },
                    name: {
                      type: 'string',
                      example: 'John Doe',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Invalid username or password',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'invalid username or password',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = loginDocs;
