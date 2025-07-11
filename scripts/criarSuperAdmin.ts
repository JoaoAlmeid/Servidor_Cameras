import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.SUPER_EMAIL || 'admin@admin.com';
  const senha = process.env.SUPER_SENHA || 'admin123';
  const nome_admin = process.env.SUPER_NOME;
  

  if (!email && !senha) {
    console.error('E-mail e senha do admin preciso ser passado pela variavel')
  }
  if (!nome_admin) {
    console.error('Nome do admin ausente na variavel')
  }

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
      nome: nome_admin,
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
