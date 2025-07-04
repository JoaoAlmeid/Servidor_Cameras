import jwt from 'jsonwebtoken';

export function gerarAccessToken(payload: object) {
  const segredo_jwt = process.env.JWT_SECRET;
  if (!segredo_jwt) {
    throw new Error('JWT_SECRET não está definido nas variáveis de ambiente.');
  }

  try {
    return jwt.sign(payload, segredo_jwt, { expiresIn: '1d' });
  } catch (error) {
    console.warn('Não foi possível gerar o token de acesso');
    throw new Error(
      error instanceof Error
        ? `Erro ao criar token de acesso: ${error.name} ${error.message}`
        : 'Erro desconhecido ao criar token de acesso'
    );
  }
}

export function gerarRefreshToken(payload: object) {
  const segredo_atualizado = process.env.JWT_REFRESH_SECRET;
  if (!segredo_atualizado) {
    throw new Error('JWT_REFRESH_SECRET não está definido nas variáveis de ambiente.');
  }

  return jwt.sign(payload, segredo_atualizado, { expiresIn: '7d' });
}
