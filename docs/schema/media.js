// mediaSchemaDocs.js

const mediaSchemaDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Media Schema Documentation',
    version: '1.0.0',
    description: 'Documentation for the Media model schema',
  },
  components: {
    schemas: {
      Media: {
        type: 'object',
        properties: {
          filename: {
            type: 'string',
            description: 'Filename of the media',
            example: 'example.jpg',
            required: true,
          },
          paths: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                size: {
                  type: 'string',
                  enum: ['large', 'medium', 'small', 'extrasmall'],
                  description: 'Size of the media',
                  example: 'large',
                  required: true,
                },
                width: {
                  type: 'number',
                  description: 'Width of the media',
                  example: 1024,
                  required: true,
                },
                path: {
                  type: 'string',
                  description: 'Path to the media',
                  example: '/media/large/example.jpg',
                  required: true,
                },
              },
            },
          },
          featuredImage: {
            type: 'string',
            description: 'Featured image path',
            example: '/media/featured/example.jpg',
            required: true,
          },
          alternateText: {
            type: 'string',
            description: 'Alternate text for the media',
            example: 'An example image',
          },
          caption: {
            type: 'string',
            description: 'Caption for the media',
            example: 'This is an example caption',
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation date of the media',
            example: '2023-05-21T12:00:00Z',
            default: 'Date.now',
          },
        },
        required: ['filename', 'paths', 'featuredImage', 'createdAt'],
      },
    },
  },
};

module.exports = mediaSchemaDocs;
