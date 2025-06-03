// Description utilisée par Swagger pour générer la documentation

const taskSchema = require('./components/task');

module.exports = {
    openapi: '3.0.0',
    info: {
        title: "TO-DO API",
        version: '1.0.0',
        description: `
## Introduction
An API built with passion during a NodeJS course at MyDigitalSchool

### Authentification
This API uses an authentication based on **JWT token**.
Client must include a token in the header of each sensitive route

### Example :
\`\`\`
Authorization: Bearer <your_token_jwt>
\`\`\`

- To obtain a token, use the endpoint **/auth/login**
- Once connected, use this token in each of your requests 
        `,
        contact: {
            name: 'Gabriel LEY',
            email: 'gabriel.ley.ext@eduservices.org'
        }
    },
    components: {
        // Indication qu'une sécurisation par Token JWT est en place
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            }
        },
        // Représentation d'une tâche
        schemas: {
            Task: taskSchema
        }
    },
    // On indique ici que la sécurité sus-mentionnée est présente partout
    security: [
        {
            BearerAuth: [],
        }
    ]
}