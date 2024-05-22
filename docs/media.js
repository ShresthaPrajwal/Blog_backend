// mediaDocs.js

const mediaDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Media Management API',
    version: '1.0.0',
    description: 'API for managing media files',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  tags: [
    {
      name: 'Media',
      description: 'Media management',
    },
  ],
  paths: {
    '/media': {
      post: {
        summary: 'Upload media files',
        tags: ['Media'],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  image: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'binary',
                    },
                  },
                  alternateText: {
                    type: 'string',
                  },
                  caption: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Media Uploaded Successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Media Uploaded Successfully',
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'No files uploaded',
          },
        },
      },
      get: {
        summary: 'Get all media',
        tags: ['Media'],
        responses: {
          200: {
            description: 'All Media Found',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/media/{id}': {
      get: {
        summary: 'Get media by ID',
        tags: ['Media'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Requested Media Found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
          404: {
            description: 'Media Not Found',
          },
        },
      },
      put: {
        summary: 'Edit media details',
        tags: ['Media'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  alternateText: {
                    type: 'string',
                  },
                  caption: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Media Updated Successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
          404: {
            description: 'Media Not Found',
          },
        },
      },
      delete: {
        summary: 'Delete media by ID',
        tags: ['Media'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Media Deleted Successfully',
          },
          404: {
            description: 'Media Not Found',
          },
        },
      },
    },
  },
};

module.exports = mediaDocs;
