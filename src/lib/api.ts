import type { Concert, HealthResponse } from '../types';

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

interface ApiConcert {
  id: string;
  concert_date: string;
  venue: string | null;
  city: string;
  state_province: string | null;
  state_abbr: string | null;
  country: string;
  lat: number | null;
  lng: number | null;
  setlist_url: string | null;
}

function mapConcert(c: ApiConcert): Concert {
  return {
    id: c.id as unknown as number,
    date: c.concert_date,
    venue: c.venue ?? '',
    city: c.city,
    state: c.state_province ?? '',
    state_abbr: c.state_abbr ?? '',
    lat: c.lat ?? undefined,
    lng: c.lng ?? undefined,
    setlist_url: c.setlist_url ?? undefined,
  };
}

export const api = {
  getHealth: (): Promise<HealthResponse> => request<HealthResponse>('/api/v1/health'),

  getConcerts: async (year: number): Promise<Concert[]> => {
    const data = await request<ApiConcert[]>(`/api/v1/concerts?year=${year}`);
    return data.map(mapConcert);
  },

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
