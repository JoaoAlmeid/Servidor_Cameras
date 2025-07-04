import prisma from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function main() {
  const email = 'superadmin@admin.com'
  const senha = 'admin123'

  const existe = await prisma.admin.findUnique({
    where: { email }
  })

  if (existe) {
    console.log('⚠️ Admin já existe.')
    process.exit(0)
  }

  const senhaCriptografada = await bcrypt.hash(senha, 12)

  const admin = await prisma.admin.create({
    data: {
      email,
      nome: 'Admin',
      senha: senhaCriptografada,
      nivel: 'SUPER'
    }
  })

  console.log('✅ Admin SUPER criado com sucesso:', admin)
}

main()
  .catch((e) => {
    console.error('Erro ao criar admin:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
