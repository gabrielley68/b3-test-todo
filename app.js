const express = require('express');

// Alimente la variable globale process.env avec le contenu du fichier .env
const dotenv = require('dotenv');
dotenv.config({
    path: process.env.NODE_ENV === "test" ? '.env.test' : '.env'
});

// Import lié à la documentation
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import des modèles, inutilisé mais permet de forcer un sequelize.alter()
require('./models');

// Import des routeurs
const indexRouter = require('./routes/index');
const taskRouter = require('./routes/tasks');
const legacyTaskRouter = require('./routes/legacy_task');
const authRouter = require('./routes/auth');

// Middleware custom
const logger = require('./middlewares/logger');
const authenticate = require('./middlewares/authentication');

const swaggerDefinition = require('./swagger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const swaggerOptions = {
    definition: swaggerDefinition,
    apis: ['./routes/tasks.js', './routes/index.js']
}

const swaggerDoc = swaggerJsDoc(swaggerOptions);

// Mise en place de la documentation avec Swagger UI
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use(logger);

app.use('/', indexRouter);
app.use('/auth', authRouter);

// Le middleware authenticate est placé ici de façon à ne pas impacter
// les routeurs index & auth (qui sont publics)
app.use(authenticate);

app.use('/tasks', taskRouter);
app.use('/legacy/tasks', legacyTaskRouter);

// Si aucun routeur n'a retourné de réponse, on renvoit une 404
app.use((req, res, next) => {
    res.status(404);
    res.send("Page not found");
});

module.exports = app;
