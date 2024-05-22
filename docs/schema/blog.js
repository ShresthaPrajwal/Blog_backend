const blogSchemaDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Blog Schema Documentation',
    version: '1.0.0',
    description: 'Documentation for the Blog model schema',
  },
  components: {
    schemas: {
      Blog: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Title of the blog',
            example: 'My First Blog Post',
            required: true,
          },
          content: {
            type: 'string',
            description: 'Content of the blog',
            example: 'This is the content of the blog post.',
            required: true,
          },
          slug: {
            type: 'string',
            description: 'Slug of the blog',
            example: 'my-first-blog-post',
            required: true,
          },
          featuredImage: {
            type: 'string',
            description: 'Featured image ID for the blog',
            example: '60c72b2f4f1a4e1d88a7f6e2',
            required: true,
          },
          media: {
            type: 'array',
            items: {
              type: 'string',
              description: 'Media IDs associated with the blog',
              example: '60c72b2f4f1a4e1d88a7f6e2',
            },
          },
        },
        required: ['title', 'content', 'slug', 'featuredImage'],
      },
    },
  },
};

module.exports = blogSchemaDocs;
