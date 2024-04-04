import jwt from 'jsonwebtoken';
export const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      req.user = decoded;
      next();
    });
  };
