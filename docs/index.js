const loginDocs = require('../docs/login');
const userDocs = require('../docs/user');
const mediaDocs = require('../docs/media');
const blogDocs = require('../docs/blog');

const userSchemaDocs = require('../docs/schema/user');
const mediaSchemaDocs = require('../docs/schema/media');
const blogSchemaDocs = require('../docs/schema/blog');


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

module.exports = {paths,tags,components};
