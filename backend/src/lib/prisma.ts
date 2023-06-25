import { PrismaClient } from '@prisma/client'
// Criação do prisma client, necessário pra utilização do ORM
export const prisma = new PrismaClient({})
