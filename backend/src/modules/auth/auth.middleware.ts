import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getJwtSecret, JwtConfigurationError } from './auth.jwt';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authenticate: RequestHandler = (req, res, next) => {
  const authorization = req.header('authorization');
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    res.status(401).json({ error: 'Token de autenticação inválido ou ausente' });
    return;
  }

  let payload: string | jwt.JwtPayload;

  try {
    payload = jwt.verify(match[1], getJwtSecret(), {
      algorithms: ['HS256'],
    });
  } catch (error) {
    if (error instanceof JwtConfigurationError) {
      console.error('Configuração JWT inválida.');
      res.status(500).json({ error: 'Erro interno do servidor' });
      return;
    }

    res.status(401).json({ error: 'Token de autenticação inválido ou expirado' });
    return;
  }

  if (
    typeof payload === 'string' ||
    typeof payload.sub !== 'string' ||
    typeof payload.exp !== 'number' ||
    payload.exp <= Math.floor(Date.now() / 1000)
  ) {
    res.status(401).json({ error: 'Token de autenticação inválido ou expirado' });
    return;
  }

  req.user = { id: payload.sub };
  next();
};
