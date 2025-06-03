const jwt = require('jsonwebtoken');
const { User } = require('../models/');

// Vérifie que l'authentification par JWT est présente et valide
async function authenticate(req, res, next){
  if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')){
    res.status(401);
    res.send("Unauthorized");
    return;
  }
    
  const token = req.headers.authorization.split(' ')[1];

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (error, payload) => {
    if(error){
      res.status(401);
      if(error.name == 'TokenExpiredError'){
        res.send("Token expired");
      } else {
        res.send("Invalid token");
      }
        return;
      }

      const user = await User.findByPk(payload.id);

      if(!user){
        res.status(401);
        res.send("Unauthorized");
      } else {
        req.user = user;
        next();
      }
    });
}

module.exports = authenticate