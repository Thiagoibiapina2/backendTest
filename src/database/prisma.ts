import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error', 'info', 'query', 'warn'],
})

async function testDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log('Conexão com o banco de dados estabelecida com sucesso')
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseConnection()

export { prisma }
