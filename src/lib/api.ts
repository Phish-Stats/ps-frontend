import type { HealthResponse } from '../types';

const BASE_URL: string = (import.meta.env['VITE_API_URL'] as string) || 'http://localhost:8000';

export interface AuthUser {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  slug: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { detail?: string };
    throw new Error(body.detail ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  getHealth: (): Promise<HealthResponse> => request<HealthResponse>('/api/v1/health'),

  login: (email: string, password: string): Promise<TokenResponse> =>
    request<TokenResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email_address: email, password }),
    }),

  register: (payload: {
    first_name: string;
    last_name: string;
    email_address: string;
    password: string;
  }): Promise<TokenResponse> =>
    request<TokenResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
