# 📡 Backend - Câmeras CCOM FM

Este é o backend responsável pelo gerenciamento das câmeras da CCOM FM. Desenvolvido por **Miguel Almeida (ACRIE)**, ele oferece uma API RESTful segura e eficiente.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **TypeScript**
- **Express 5**
- **Prisma ORM**
- **PostgreSQL**
- **PM2** (gerenciador de processos)
- **tsup** (empacotador)
- **dotenv**
- **ffmpeg** (via `@ffmpeg-installer`)

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com o conteúdo do exemplo `.env.example`.

---

## 🛠️ Instalação e Execução Local

```bash
# Clonar o repositório
git clone {url_github}
cd backend

# Instalar as dependências
npm install

# Gerar o cliente do Prisma
npx prisma generate

# Executar em modo de desenvolvimento
npm run dev
```

---

## 🛠️ Instalação e Execução no Servidor

```bash
# Clonar o repositório
git clone {url_github}
cd backend

# Instalar as dependências
npm install

# Descompactar a pasta do FFMPEG
unzip -q ffmpeg.zip

# Aplicar as migrações do Prisma
npx prisma migrate deploy

# Compilar a aplicação
npm run build

# Iniciar com PM2
npm run start
```

---

## 👨‍💻 Autor

**Miguel Almeida**  - Desenvolvedor Full - **ACRIE**
📧 [joao.miguel@acrie.com.br](mailto:joao.miguel@acrie.com.br)

💻 [acrie.com.br](https://acrie.com.br)