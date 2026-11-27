import jwt from 'jsonwebtoken';

export class JwtConfigurationError extends Error {
  constructor() {
    super('JWT_SECRET must be configured with at least 32 bytes');
    this.name = 'JwtConfigurationError';
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new JwtConfigurationError();
  }

  return secret;
}

export function createAuthToken(userId: string): string {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: 'HS256',
    subject: userId,
    expiresIn: '24h',
  });
}
