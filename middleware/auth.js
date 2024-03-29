const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'CHANGE_ME');
    const userId = decodedToken.userId
    if(req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID'
    } else {
      console.log('Authorized')
      next();
    }
  } catch {
    console.log('Something went wrong with authorization')
    res.status(401).json({ 
      error: new Error('Invalid request')
    });
  }
}