-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'CLIENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "HallType" AS ENUM ('PLEIN_AIR', 'SALLE', 'VILLA', 'TERRASSE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'OWNER',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "phoneVerifiedAt" TIMESTAMP(3),
    "avatarKey" TEXT,
    "otp" TEXT,
    "otpExpiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "halls" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(170),
    "description" TEXT,
    "wilaya" VARCHAR(100),
    "commune" VARCHAR(100),
    "address" TEXT,
    "capacity" INTEGER,
    "type" "HallType" NOT NULL,
    "priceDay" DECIMAL(10,2),
    "intervalDayFrom" TIME,
    "intervalDayTo" TIME,
    "priceEvening" DECIMAL(10,2),
    "intervalEveningFrom" TIME,
    "intervalEveningTo" TIME,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "hallServices" JSONB NOT NULL DEFAULT '[]',
    "mediaFolder" VARCHAR(255),
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "ratingAvg" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "halls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_images" (
    "id" SERIAL NOT NULL,
    "hallId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT,
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hall_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_token" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hall_services" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100),

    CONSTRAINT "hall_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "codes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "halls_slug_key" ON "halls"("slug");

-- CreateIndex
CREATE INDEX "halls_ownerId_idx" ON "halls"("ownerId");

-- CreateIndex
CREATE INDEX "halls_wilaya_idx" ON "halls"("wilaya");

-- CreateIndex
CREATE INDEX "halls_latitude_longitude_idx" ON "halls"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "hall_images_hallId_idx" ON "hall_images"("hallId");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token"("token");

-- CreateIndex
CREATE INDEX "refresh_token_userId_idx" ON "refresh_token"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "hall_services_name_key" ON "hall_services"("name");

-- CreateIndex
CREATE UNIQUE INDEX "hall_services_slug_key" ON "hall_services"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "codes_code_key" ON "codes"("code");

-- AddForeignKey
ALTER TABLE "halls" ADD CONSTRAINT "halls_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hall_images" ADD CONSTRAINT "hall_images_hallId_fkey" FOREIGN KEY ("hallId") REFERENCES "halls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
