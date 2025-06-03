const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *    description: Hello world
 *    responses:
 *      200:
 *        description: hello world
 * 
 */
router.get('/', function(req, res, next) {
  res.send("Hello world v4");
});

router.get('/favicon.ico', (req, res) => res.sendStatus(204));

module.exports = router;
