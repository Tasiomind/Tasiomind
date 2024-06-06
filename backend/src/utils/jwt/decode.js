import jwt from 'jsonwebtoken';
export const decode = token => jwt.decode(token);
