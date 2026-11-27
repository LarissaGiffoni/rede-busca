export type ApiValidationDetail = {
  field: string
  message: string
}

export class ApiError extends Error {
  public readonly status: number
  public readonly details: ApiValidationDetail[]

  constructor(
    message: string,
    status: number,
    details: ApiValidationDetail[] = [],
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

type RequestOptions = Omit<RequestInit, 'headers'> & {
  headers?: HeadersInit
  token?: string
}

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim()

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, '')
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:3000'
  }

  throw new ApiError('A URL da API não está configurada.', 0)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseDetails(value: unknown): ApiValidationDetail[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((item): ApiValidationDetail[] => {
    if (
      isRecord(item) &&
      typeof item.field === 'string' &&
      typeof item.message === 'string'
    ) {
      return [{ field: item.field, message: item.message }]
    }

    return []
  })
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, ...requestOptions } = options
  const headers = new Headers(requestOptions.headers)

  if (requestOptions.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...requestOptions,
      headers,
    })
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError(
        'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
        0,
      )
    }

    throw error
  }

  const responseText = await response.text()
  let payload: unknown

  if (responseText) {
    try {
      payload = JSON.parse(responseText)
    } catch {
      if (response.ok) {
        throw new ApiError('O servidor retornou uma resposta inválida.', response.status)
      }
    }
  }

  if (!response.ok) {
    const message =
      isRecord(payload) && typeof payload.error === 'string'
        ? payload.error
        : 'Não foi possível concluir a solicitação. Tente novamente.'
    const details = isRecord(payload) ? parseDetails(payload.details) : []

    throw new ApiError(message, response.status, details)
  }

  if (payload === undefined) {
    throw new ApiError('O servidor retornou uma resposta vazia.', response.status)
  }

  return payload as T
}
