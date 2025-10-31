import jwt from 'jsonwebtoken';
import { JWT_MESSAGES } from '../constants/jwtConstants.js';

const { verify } = jwt;

const jwtAuthMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: JWT_MESSAGES.NO_TOKEN });
  }

  try {
    const decoded = verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: JWT_MESSAGES.INVALID_TOKEN });
  }
};

export default jwtAuthMiddleware;
