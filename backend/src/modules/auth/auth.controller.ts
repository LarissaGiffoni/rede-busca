import type { RequestHandler } from 'express';
import {
  DuplicateEmailError,
  getUserById,
  loginUser,
  registerUser,
} from './auth.service';
import { loginSchema, registerSchema } from './auth.schema';

export const register: RequestHandler = async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: result.error.issues.map(({ path, message }) => ({
        field: path.join('.'),
        message,
      })),
    });
    return;
  }

  try {
    const user = await registerUser(result.data);
    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof DuplicateEmailError) {
      res.status(409).json({ error: 'E-mail já cadastrado' });
      return;
    }

    console.error('Erro interno ao cadastrar usuário.');
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const login: RequestHandler = async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: 'Dados inválidos',
      details: result.error.issues.map(({ path, message }) => ({
        field: path.join('.'),
        message,
      })),
    });
    return;
  }

  try {
    const loginResult = await loginUser(result.data);

    if (!loginResult) {
      res.status(401).json({ error: 'E-mail ou senha incorretos' });
      return;
    }

    res.status(200).json(loginResult);
  } catch {
    console.error('Erro interno ao autenticar usuário.');
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const me: RequestHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: 'Token de autenticação inválido ou ausente' });
    return;
  }

  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      res.status(401).json({ error: 'Token de autenticação inválido ou expirado' });
      return;
    }

    res.status(200).json({ user });
  } catch {
    console.error('Erro interno ao buscar usuário autenticado.');
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};
