# Imagem base oficial do Node
FROM node:22-slim

# Variáveis de ambiente
ENV NODE_ENV=production

# Criar diretório da aplicação
WORKDIR /app

# Copiar os arquivos de dependências primeiro para cache otimizado
COPY package*.json ./
COPY prisma ./prisma

# Instalar PM2 e dependências
RUN npm install -g pm2 \
    && npm install --omit=dev \
    && npx prisma generate

# Build do projeto (via tsup)
RUN npm run build

# Expor porta (usada no compose)
EXPOSE ${BACKEND_PORT}

# Rodar com PM2
CMD ["pm2-runtime", "dist/server.cjs"]
