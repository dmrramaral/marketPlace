const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MarketPlace API',
      version: '1.0.0',
      description: 'Documentação da API do MarketPlace',
    },
    servers: [
      { url: 'http://localhost:3000/api' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearer: 'JWT',
        }
      },
      schemas: {
        Address: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            street: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string' },
            country: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        UserCreate: {
          type: 'object',
          required: ['name','email','password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            addresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/Address' }
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            addresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/Address' }
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Category: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' }
          }
        },
        ProductCreate: {
          type: 'object',
          required: ['name','price','stock'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: {
              type: 'array',
              items: { type: 'string', description: 'Category ObjectId' }
            },
            stock: { type: 'integer' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: {
              type: 'array',
              items: { $ref: '#/components/schemas/Category' }
            },
            stock: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        CartProduct: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Product ObjectId' },
            quantity: { type: 'integer' }
          }
        },
        CartRequest: {
          type: 'object',
          properties: {
            products: {
              type: 'array',
              items: { $ref: '#/components/schemas/CartProduct' }
            },
            user: { type: 'string', description: 'User ObjectId (opcional se obtido via token)' }
          }
        },
        Cart: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            user: { $ref: '#/components/schemas/User' },
            products: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { $ref: '#/components/schemas/Product' },
                  quantity: { type: 'integer' },
                  addedAt: { type: 'string', format: 'date-time' }
                }
              }
            },
            totalPrice: { type: 'number' },
            frete: { type: 'number' },
            paymentStatus: { type: 'string' }
          }
        },
        AuthLogin: {
          type: 'object',
          required: ['email','password'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      } // schemas
    }, // components
  }, // definition
  apis: ['./src/router/*.js'], // Caminho para os arquivos de rotas/controllers
};

const swaggerSpec = swaggerJSDoc(options);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;