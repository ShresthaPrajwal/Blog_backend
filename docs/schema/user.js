// userSchemaDocs.js

const userSchemaDocs = {
  openapi: '3.0.0',
  info: {
    title: 'User Schema Documentation',
    version: '1.0.0',
    description: 'Documentation for the User model schema',
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            description: 'Unique username for the user',
            example: 'john_doe',
            unique: true,
          },
          name: {
            type: 'string',
            description: 'Name of the user',
            example: 'John Doe',
          },
          passwordHash: {
            type: 'string',
            description: 'Hashed password of the user',
            example: '$2a$12$QWERTYUIOPASDFGHJKLZXCVBNM1234567890',
          },
        },
        required: ['username'],
      },
    },
  },
};

module.exports = userSchemaDocs;
