const loginDocs = require('./login');
const userDocs = require('./user');
const mediaDocs = require('./media');
const blogDocs = require('./blog');

const userSchemaDocs = require('./schema/user');
const mediaSchemaDocs = require('./schema/media');
const blogSchemaDocs = require('./schema/blog');

const paths = {
  ...loginDocs.paths,
  ...userDocs.paths,
  ...mediaDocs.paths,
  ...blogDocs.paths,
};

const tags = {
  ...loginDocs.tags,
  ...userDocs.tags,
  ...mediaDocs.tags,
  ...blogDocs.tags,
};

const components = {
  schemas: {
    ...userSchemaDocs.components.schemas,
    ...mediaSchemaDocs.components.schemas,
    ...blogSchemaDocs.components.schemas,
  },
};

module.exports = { paths, tags, components };
