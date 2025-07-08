import { serialize } from 'cookie';

export function gerarCookiesDeAutenticacao(token: string, refreshToken: string) {
  const tokenCookie = serialize('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'none',
  });

  const refreshTokenCookie = serialize('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'none',
  });

  return [tokenCookie, refreshTokenCookie];
}
