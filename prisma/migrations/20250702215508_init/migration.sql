-- CreateEnum
CREATE TYPE "NivelAdmin" AS ENUM ('SUPER', 'SIMPLES');

-- CreateTable
CREATE TABLE "Admin" (
    "adminId" TEXT NOT NULL,
    "nome" TEXT,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "nivel" "NivelAdmin" NOT NULL DEFAULT 'SIMPLES',
    "refreshToken" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "Camera" (
    "cameraId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "nome" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Camera_pkey" PRIMARY KEY ("cameraId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Camera_url_key" ON "Camera"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Camera_nome_key" ON "Camera"("nome");
