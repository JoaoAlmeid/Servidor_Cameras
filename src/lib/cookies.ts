import { serialize } from 'cookie';

export function gerarCookiesDeAutenticacao(token: string, refreshToken: string) {
  const tokenCookie = serialize('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  });

  const refreshTokenCookie = serialize('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });

  return [tokenCookie, refreshTokenCookie];
}
