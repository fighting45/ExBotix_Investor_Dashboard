const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Investor Dashboard API',
      version: '1.0.0',
      description: 'API documentation for Investor Dashboard Exbotix Backend',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, '../docs/investor/*.js'),
    path.join(__dirname, '../docs/prices/*.js'),
    path.join(__dirname, '../docs/auth/*.js'),
    path.join(__dirname, '../docs/users/*.js'),
    path.join(__dirname, '../app.js'),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = swaggerSpec;

