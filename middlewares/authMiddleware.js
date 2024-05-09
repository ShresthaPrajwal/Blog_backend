const { SECRET } = require('../config/config')
const jwt = require('jsonwebtoken');

const authMiddleware = (request, response, next) => {
  let token;
  const authorization = request.get('Authorization');
  console.log('From authMiddleware',authorization);
  if(!authorization){
    response.status(498).json({error: 'Invalid Token'})
  }
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.replace('Bearer ', '');
    try {
      const decodedToken = jwt.verify(token, SECRET);
      request.user = decodedToken;
      console.log(decodedToken);
    } catch (error) {
      return response.status(401).json({ error: 'Invalid token' });
    }
  } else {
    token = null;
  }
  request.token = token;
  next();
};

module.exports = authMiddleware;