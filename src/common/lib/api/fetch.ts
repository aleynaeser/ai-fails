export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IApiFetchOptions<TBody = unknown> {
  method?: THttpMethod;
  body?: TBody;
}

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
};

/**
 * Global typed API fetcher. Use for all API calls so method, path and response type are consistent.
 */
export async function apiFetch<TResponse, TBody = unknown>(
  path: string,
  options?: IApiFetchOptions<TBody>
): Promise<TResponse> {
  const { method = 'GET', body } = options ?? {};
  const hasBody = body !== undefined && method !== 'GET';

  const res = await fetch(path, {
    method,
    headers: hasBody ? defaultHeaders : undefined,
    body: hasBody ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(typeof data?.error === 'string' ? data.error : 'Request failed');
  }

  return data as TResponse;
}
