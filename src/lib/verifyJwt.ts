import jwt from 'jsonwebtoken'

export function verifyJwt<T = any>(token: string): T | null {
  try {
    const segredo = process.env.JWT_SECRET
    if (!segredo) throw new Error('Token JWT inexistente')
    const decoded = jwt.verify(token, segredo)
    return decoded as T
  } catch (error) {
    console.error('Token JWT inválido ou expirado:', error)
    return null
  }
}
