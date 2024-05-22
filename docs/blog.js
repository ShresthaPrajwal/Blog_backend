// blogDocs.js

const blogDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Blog Management API',
    version: '1.0.0',
    description: 'API for managing blogs',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
    },
  ],
  tags: [
    {
      name: 'Blogs',
      description: 'Blog management',
    },
  ],
  paths: {
    '/blogs': {
      post: {
        summary: 'Upload a new blog',
        tags: ['Blogs'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'My New Blog',
                  },
                  content: {
                    type: 'string',
                    example: 'This is the content of my new blog.',
                  },
                  featuredImage: {
                    type: 'string',
                    example: 'imageId',
                  },
                  media: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['mediaId1', 'mediaId2'],
                  },
                },
                required: ['title', 'content'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Blog uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Blog uploaded successfully!',
                    },
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                      example: {
                        _id: 'blogId',
                        title: 'My New Blog',
                        content: 'This is the content of my new blog.',
                        slug: 'my-new-blog',
                        featuredImage: 'imageId',
                        media: ['mediaId1', 'mediaId2'],
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad request',
          },
        },
      },
      get: {
        summary: 'Get all blogs',
        tags: ['Blogs'],
        responses: {
          200: {
            description: 'All blogs retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'array',
                      items: {
                        type: 'object',
                        example: {
                          _id: 'blogId',
                          title: 'My Blog',
                          content: 'This is the content of my blog.',
                          slug: 'my-blog',
                          featuredImage: 'imageId',
                          media: ['mediaId1', 'mediaId2'],
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
    },
    '/blogs/{slug}': {
      get: {
        summary: 'Get blog by slug',
        tags: ['Blogs'],
        parameters: [
          {
            in: 'path',
            name: 'slug',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Slug of the blog to retrieve',
          },
        ],
        responses: {
          200: {
            description: 'Blog retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    data: {
                      type: 'object',
                      example: {
                        _id: 'blogId',
                        title: 'My Blog',
                        content: 'This is the content of my blog.',
                        slug: 'my-blog',
                        featuredImage: 'imageId',
                        media: ['mediaId1', 'mediaId2'],
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Blog not found',
          },
        },
      },
      put: {
        summary: 'Update blog details',
        tags: ['Blogs'],
        parameters: [
          {
            in: 'path',
            name: 'slug',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Slug of the blog to update',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Updated Blog Title',
                  },
                  content: {
                    type: 'string',
                    example: 'This is the updated content of the blog.',
                  },
                  featuredImage: {
                    type: 'string',
                    example: 'newImageId',
                  },
                  media: {
                    type: 'array',
                    items: {
                      type: 'string',
                    },
                    example: ['newMediaId1', 'newMediaId2'],
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Blog updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Blog updated successfully',
                    },
                    data: {
                      type: 'object',
                      example: {
                        _id: 'blogId',
                        title: 'Updated Blog Title',
                        content: 'This is the updated content of the blog.',
                        slug: 'updated-blog-title',
                        featuredImage: 'newImageId',
                        media: ['newMediaId1', 'newMediaId2'],
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Blog not found',
          },
        },
      },
      delete: {
        summary: 'Delete blog by slug',
        tags: ['Blogs'],
        parameters: [
          {
            in: 'path',
            name: 'slug',
            required: true,
            schema: {
              type: 'string',
            },
            description: 'Slug of the blog to delete',
          },
        ],
        responses: {
          200: {
            description: 'Blog deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Blog deleted successfully',
                    },
                    data: {
                      type: 'object',
                      example: {
                        _id: 'deletedBlogId',
                        title: 'Deleted Blog Title',
                        content: 'This is the content of the deleted blog.',
                        slug: 'deleted-blog-title',
                        featuredImage: 'deletedImageId',
                        media: ['deletedMediaId1', 'deletedMediaId2'],
                      },
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Blog not found',
          },
        },
      },
    },
  },
};

module.exports = blogDocs;
