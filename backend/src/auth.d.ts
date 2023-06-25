import '@fastify/jwt'

// Type para o token JWT
declare module '@fastify/jwt' {
  export interface FastifyJWT {
    user: {
      sub: string
      name: string
    }
  }
}
