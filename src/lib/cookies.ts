import { serialize } from 'cookie';

export function gerarCookiesDeAutenticacao(token: string, refreshToken: string) {
  const tokenCookie = serialize('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24,
    path: '/',
    domain: '.ccomfm.com.br'
  });

  const refreshTokenCookie = serialize('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    domain: '.ccomfm.com.br'
  });

  return [tokenCookie, refreshTokenCookie];
}
