const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const { paths, tags, components } = require('../docs/index');

// //module.exports = {
//   server,basicinfo,security
// }
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation for API endpoints',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      ...components,
    },
    security: [{ bearerAuth: [] }],
    servers: [
      {
        url: 'http://localhost:3003/api',
      },
    ],
    paths,
  },
  apis: [path.join(__dirname, '../docs/*.js')],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  // for docs in json format
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
  console.log(`docs available at http://localhost:3003/api-docs`);
};
