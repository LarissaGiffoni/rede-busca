import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../../config/prisma';
import { createAuthToken } from './auth.jwt';
import type { LoginInput, RegisterInput } from './auth.schema';

export class DuplicateEmailError extends Error {
  constructor() {
    super('E-mail já cadastrado');
    this.name = 'DuplicateEmailError';
  }
}

export async function registerUser(input: RegisterInput) {
  const passwordHash = await bcrypt.hash(input.password, 10);

  try {
    return await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new DuplicateEmailError();
    }

    throw error;
  }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      createdAt: true,
    },
  });

  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    return null;
  }

  return {
    token: createAuthToken(user.id),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
  };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}
