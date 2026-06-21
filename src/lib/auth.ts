import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    throw new Error('No token, authorization denied');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    return {
      user: decoded,
      isAdmin: decoded.role === 'admin'
    };
  } catch (err) {
    throw new Error('Token is not valid');
  }
}
