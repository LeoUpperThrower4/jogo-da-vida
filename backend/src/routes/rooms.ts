import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { FastifyRequest } from 'fastify/types/request'
import { z } from 'zod'

// type para os parâmetros da sala
interface RoomParams {
  roomId: string
}

// Variável que conterá as rotas relacionada a sala
export async function roomsRoutes(app: FastifyInstance) {
  // Criação de sala, juntamente com a criação do usuário no banco
  app.post('/room', async (request, reply) => {
    const bodySchema = z.object({
      username: z.string(),
    })

    // Criando usuário no banco
    console.log('usuário Criado')
    const { username } = bodySchema.parse(request.body)
    const user = await prisma.user.create({
      data: {
        name: username,
      },
    })
    // Criando sala no banco
    console.log('Sala Criada')
    const room = await prisma.room.create({
      data: {
        players: {
          connect: { id: user.id },
        },
        hostId: user.id,
      },
    })
    // Criando Token jwt para identificar o usuário
    const token = app.jwt.sign(
      {
        name: user.name,
      },
      {
        sub: user.id,
        expiresIn: '7 days',
      },
    )
    // Adicionando a resposta o cookie
    reply.setCookie('token', token, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: false,
    })

    // Enviando a resposta com os id's criados
    console.log('response enviada')
    reply.code(201).send({ roomId: room.id, userId: user.id })
  })
  // Rota de adição de usuário a sala, assim como criação de usuário
  app.post(
    '/room/:roomId/join',
    async (request: FastifyRequest<{ Params: RoomParams }>, reply) => {
      const bodySchema = z.object({
        username: z.string(),
      })

      const { username } = bodySchema.parse(request.body)
      const { roomId } = request.params

      // Identificando a sala no banco
      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          players: true,
        },
      })
      // Verificações de salas
      if (!room) {
        reply.status(404).send({ message: 'Sala não encontrada' })
        return
      }
      if (room.players.length === 3) {
        reply.status(400).send({ message: 'Sala Cheia' })
        return
      }
      if (room.gameStarted) {
        reply.status(400).send({ message: 'Jogo já iniciado' })
        return
      }
      // Criando usuário no banco
      const user = await prisma.user.create({
        data: {
          name: username,
        },
      })
      // Criando token jwt
      const token = app.jwt.sign(
        {
          name: user.name,
        },
        {
          sub: user.id,
          expiresIn: '7 days',
        },
      )
      // Adicionando usuário a sala
      await prisma.room.update({
        where: {
          id: roomId,
        },
        data: {
          players: {
            connect: {
              id: user.id,
            },
          },
        },
      })
      // Enviando token para o usuário
      reply.setCookie('token', token, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: false,
      })
      // Enviando o usuário criado e a sala
      reply.code(200).send({ roomId: room.id, userId: user.id })
    },
  )
  // Rota para deletar sala criada
  app.delete(
    '/room/:roomId',
    async (request: FastifyRequest<{ Params: RoomParams }>, reply) => {
      // Verifica o token do usuário para pegar o userId
      console.log('Delete')
      await request.jwtVerify()
      const { roomId } = request.params
      // Deleta o usuário do banco
      await prisma.user.delete({
        where: {
          id: request.user.sub,
        },
      })
      // Deleta a sala do banco
      await prisma.room.delete({
        where: {
          id: roomId,
        },
      })
      // Limpa os cookies
      reply.clearCookie('token')
      reply.code(200).send()
    },
  )
}
