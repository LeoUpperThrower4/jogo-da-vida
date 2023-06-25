import 'dotenv/config'

import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import cookie from '@fastify/cookie'
import { roomsRoutes } from './routes/rooms'
import { env } from './env/index'
import { socketsRoutes } from './routes/sockets'
const app = fastify()

// Registrando Cors, permitindo somente a porta do front-end
app.register(cors, {
  origin: 'http://localhost:3000',
  credentials: true,
})

// Registrando serviço de cookies
app.register(cookie)

// Registrando serviço de tokens jwt
app.register(jwt, {
  secret: env.JWT_SECRET,
})
// Registrando rotas da api de salas
app.register(roomsRoutes)

// Registrando Websocket
app.register(require('@fastify/websocket'))
app.register(socketsRoutes)

// Iniciando o servidor na porta especificada
app
  .listen({
    port: env.PORT,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log(`🚀 HTTP server running on port http://localhost:${env.PORT}`)
  })
