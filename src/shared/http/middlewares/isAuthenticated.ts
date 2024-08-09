import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const { authorization } = request.headers;

  if (!authorization) {
    throw new AppError('Unauthorized', 401);
  }

  try {
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new Error();
    }

    const { sub } = verify(token, authConfig.jwt.secret) as JwtPayload;

    request.user = {
      id: sub!
    };

    return next();
  } catch {
    throw new AppError('Unauthorized', 401);
  }
}
