import { apiRequest } from './api'

export type PublicUser = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type LoginCredentials = {
  email: string
  password: string
}

export type RegistrationDetails = {
  name: string
  email: string
  password: string
}

type UserResponse = {
  user: PublicUser
}

export type LoginResponse = UserResponse & {
  token: string
}

export function registerUser(details: RegistrationDetails) {
  return apiRequest<UserResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(details),
  })
}

export function loginUser(credentials: LoginCredentials) {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getCurrentUser(token: string) {
  return apiRequest<UserResponse>('/api/auth/me', { token })
}
