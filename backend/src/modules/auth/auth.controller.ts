import type { RequestHandler } from 'express';
import { DuplicateEmailError, registerUser } from './auth.service';
import { registerSchema } from './auth.schema';

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
