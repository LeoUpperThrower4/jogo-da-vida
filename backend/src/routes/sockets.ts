import { FastifyInstance, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import jwt from 'jsonwebtoken'
import { env } from 'process'
import { randomUUID } from 'crypto'
import { getNewXY } from '../utils/GameBoard'

function getNextPlayer(roomSet: Array<any>, currentUserIndex: number) {
  // calcula o novo jogador do dado
  const nextUserIndex =
    currentUserIndex + 1 >= roomSet.length ? 0 : currentUserIndex + 1

  return roomSet[nextUserIndex].userId
}

// Registro de Conexões por salas
const roomConnections: Map<string, Array<any>> = new Map()

export async function socketsRoutes(app: FastifyInstance) {
  // Socket na rota room/:id  Obs só entra logado nessa rota, verificação do front
  app.get(
    '/room/:roomId',
    { websocket: true },
    async (connection, req: FastifyRequest) => {
      // Recebe o token, que é convertido para o id do usuário, para identifica-lo
      const token = req.cookies.token ?? null
      const { sub } = token ? jwt.verify(token, env.JWT_SECRET!) : { sub: null }
      // Verifica se o usuário realmente existe
      const user = await prisma.user.findUnique({
        where: {
          id: sub?.toString(),
        },
      })
      // Caso não haja usuário, a conexão é cancelada
      if (!user) {
        connection.socket.close(
          1000,
          'Conexão encerrada pelo servidor. Usuário não existe',
        )
        return
      }
      // Recebe o roomId através de parâmetros
      const roomId = req?.params?.roomId
      // Verifica se a sala existe no prisma
      const room = await prisma.room.findUnique({
        where: {
          id: roomId,
        },
        include: {
          players: true,
        },
      })
      // Caso não haja sala, a conexão é cancelada
      if (!room) {
        connection.socket.close(
          1000,
          'Conexão encerrada pelo servidor. Sala não existe',
        )
        return
      }
      // Verifica o limite máximo da sala, se já existirem 6 jogadores, fecha a conexão
      if (room.players.length > 6) {
        console.log(room.players.length)
        connection.socket.close(
          1000,
          'Conexão encerrada pelo servidor. Sala cheia',
        )
      }
      // Adiciona a conexão atual ao conjunto de conexões ativas da sala
      if (!roomConnections.has(roomId)) {
        roomConnections.set(roomId, [])
      }
      // Adiciona a conexão, na lista de conexões por sala
      const roomSet = roomConnections.get(roomId)
      if (roomSet) {
        roomSet.push({ connection: connection.socket, userId: sub })
        // Envia mensagem que o usuário entrou na sala para todos pertencentes a sala
        roomSet.forEach((socket) => {
          const message = {
            id: randomUUID().toString(),
            for: 'chat',
            type: 'join',
            userId: sub,
            username: user.name,
            content: 'entrou na sala',
          }
          socket.connection.send(JSON.stringify(message))
        })
      }

      // Quando uma nova mensagem é recebida do frontend
      connection.socket.on('message', async (data) => {
        // Transforma a informação em json
        const message = JSON.parse(data)
        // Lista com todas as conexões da sala
        const roomSet = roomConnections.get(roomId)
        // Procura no banco o usuário que enviou a mensagem
        const username = await prisma.user.findFirst({
          where: {
            id: message.userId,
          },
        })
        console.log(`userId: ${message.userId}; username: ${username?.name}`)
        // Verifica se é chat ou jogo
        if (message.for === 'chat') {
          if (roomSet) {
            // Procura o nome do usuário para usar no chat
            // Envia a mensagem para todos
            roomSet.forEach((socket) => {
              const newMessage = JSON.stringify({
                id: randomUUID().toString(),
                username: username?.name,
                ...message,
              })
              socket.connection.send(newMessage)
            })
          }
        } else if (message.for === 'game') {
          if (roomSet) {
            // Verificações de type de mensagem
            if (message.type === 'start_game') {
              // Seleciona aleatoriamente um jogador para começar o jogo
              console.log('escolhendo um jogador')
              const chosenPlayer =
                roomSet[Math.floor(Math.random() * roomSet.length)].userId
              console.log(`jogador ${chosenPlayer} escolhido`)
              // Atualiza a sala indicando que inicio o jogo, qual o jogador inicial e as posições deles
              await prisma.room.update({
                where: {
                  id: roomId,
                },
                data: {
                  gameStarted: true,
                  currentTurnPlayerId: chosenPlayer,
                  positions: {
                    create: roomSet.map((socket) => ({
                      playerId: socket.userId,
                      positionX: 0,
                      positionY: 0,
                    })),
                  },
                },
              })
              // Envia mensagem para todos informando o jogador a rolar o dado e a lista de jogadores
              roomSet.forEach((socket) => {
                socket.connection.send(
                  JSON.stringify({
                    for: 'game',
                    type: 'start_game',
                    userIdCurrentTurn: chosenPlayer,
                    playersIds: [...roomSet.map((socket) => socket.userId)],
                  }),
                )
              })
            } else if (message.type === 'roll_dice') {
              const roomTurn = await prisma.room.findUnique({
                where: {
                  id: roomId,
                },
              })

              // Verifica se o jogador tem a permissão de rodar o dado
              if (roomTurn?.currentTurnPlayerId === message.userId) {
                // Calcula o valor que foi tirado no dado
                const diceValue = Math.floor(Math.random() * 6) + 1
                // Pega as posições anteriores para que possa atualizar
                const roomPositions = await prisma.room.findFirst({
                  where: {
                    id: roomId,
                  },
                  include: {
                    positions: true,
                  },
                })
                // Se não tiver, deu algum erro, retorna
                if (!roomPositions) return

                // encontra o index do usuário no array de usuários da sala
                const currentUserIndex = roomSet.findIndex(
                  (socket) => socket.userId === message.userId,
                )

                const newPlayersPositions = roomPositions.positions.map(
                  (playerPosition) => {
                    if (
                      playerPosition.playerId ===
                      roomSet[currentUserIndex].userId
                    ) {
                      const { outX, outY } = getNewXY(
                        playerPosition.positionX,
                        playerPosition.positionY,
                        diceValue,
                      )
                      return {
                        ...playerPosition,
                        positionX: outX,
                        positionY: outY,
                      }
                    }
                    return playerPosition
                  },
                )
                // Atualiza o DB com as novas posições
                for (const playerPosition of newPlayersPositions) {
                  const { playerId, positionX, positionY } = playerPosition
                  await prisma.positionPlayer.update({
                    where: { playerId },
                    data: {
                      positionX,
                      positionY,
                    },
                  })
                }

                // verifica se uma das posições é a final, se for, acaba o jogo
                const finalPosition = newPlayersPositions.find(
                  (playerPosition) =>
                    playerPosition.positionX === 4 &&
                    playerPosition.positionY === 4,
                )
                if (finalPosition) {
                  // Envia mensagem para todos os jogadores que o jogo acabou
                  console.log(
                    `Jogo finalizado. Houve um ganhador: ${finalPosition.playerId}`,
                  )
                  roomSet.forEach((socket) => {
                    socket.connection.send(
                      JSON.stringify({
                        for: 'game',
                        type: 'end_game',
                        username: username?.name,
                        winnerId: finalPosition.playerId,
                      }),
                    )
                  })
                  return
                }

                // Atualiza a sala com o novo jogador do dado
                await prisma.room.update({
                  where: {
                    id: roomId,
                  },
                  data: {
                    currentTurnPlayerId: getNextPlayer(
                      roomSet,
                      currentUserIndex,
                    ),
                  },
                })

                // Envia o valor do dado para todos os jogadores e indica que o turno acabou
                // retornando as novas posições e o novo jogador a jogar
                roomSet.forEach((socket) => {
                  socket.connection.send(
                    JSON.stringify({
                      for: 'game',
                      type: 'roll_dice',
                      username: username?.name,
                      userId: message.userId,
                      diceValue,
                    }),
                  )
                  socket.connection.send(
                    JSON.stringify({
                      for: 'game',
                      type: 'end_turn',
                      userIdCurrentTurn: getNextPlayer(
                        roomSet,
                        currentUserIndex,
                      ),
                      newPlayersPositions,
                    }),
                  )
                })
              } else {
                // só retorna se não for a vez do usuário
              }
            }
          }
        }
      })

      // Validações e execuções ao fechar as conexões
      connection.socket.on('close', async () => {
        // Valida a sala
        const roomSet = roomConnections.get(roomId)
        if (roomSet) {
          // É preciso verificar todos os sockets do roomSet
          for (const socket of roomSet) {
            // Encontrado o Socket desconectado verificamos seu ID de usuário e se o usuário existe realmente
            if (socket.connection === connection.socket) {
              const userId = socket.userId
              // É feita a retirada do usuário atual da lista de sockets e do banco
              try {
                roomSet.splice(roomSet.indexOf(socket), 1)
                await prisma.user.deleteMany({
                  where: {
                    id: userId,
                  },
                })
              } catch (error) {
                console.log('Error deleting user: ', error)
              }
              // Verifica-se se o usuário era o host
              const Host = await prisma.room.findFirst({
                where: {
                  id: roomId,
                  hostId: userId,
                },
              })
              // Caso seja o host, a sala termina, finalizando todas as conexões
              if (Host) {
                await prisma.positionPlayer.deleteMany({
                  where: {
                    roomId,
                  },
                })
                roomSet.forEach((socket) => {
                  socket.connection.close()
                })
              } else {
                // A sala é atualizada, indicando que o antigo usuário, saiu da sala
                const hasPosition = await prisma.positionPlayer.findFirst({
                  where: {
                    playerId: userId,
                  },
                })
                if (hasPosition) {
                  await prisma.positionPlayer.delete({
                    where: {
                      playerId: userId,
                    },
                  })
                }
                const existRoom = await prisma.room.findUnique({
                  where: {
                    id: roomId,
                  },
                })
                if (existRoom) {
                  const roomStats = await prisma.room.update({
                    where: {
                      id: roomId,
                    },
                    data: {
                      players: {
                        disconnect: {
                          id: userId,
                        },
                      },
                    },
                  })

                  // Para cada usuário na sala é enviada uma mensagem indicando que o usuário saiu
                  roomSet.forEach((socket) => {
                    const message = {
                      id: randomUUID().toString(),
                      for: 'chat',
                      type: 'exit',
                      userId,
                      username: user.name,
                      content: `saiu da sala`,
                    }
                    socket.connection.send(JSON.stringify(message))
                  })

                  if (
                    roomStats &&
                    roomStats.gameStarted === true &&
                    roomStats.currentTurnPlayerId === userId
                  ) {
                    const roomPositions = await prisma.room.findUnique({
                      where: {
                        id: roomId,
                      },
                      include: { positions: true },
                    })
                    if (roomPositions?.hostId === userId) {
                      return
                    }
                    // Seleciona o novo jogador a jogar o dado
                    const currentUserIndex = roomSet.findIndex(
                      (socket) => socket.userId === userId,
                    )

                    // Atualiza a sala indicando a saída do player
                    if (roomPositions) {
                      const newPlayersPositions = roomPositions.positions
                      await prisma.room.update({
                        where: {
                          id: roomId,
                        },
                        data: {
                          currentTurnPlayerId:
                            roomSet[currentUserIndex]?.userId,
                        },
                      })
                      // Envia mensagem para todos informando o novo jogador a jogar o dado
                      roomSet.forEach((socket) => {
                        socket.connection.send(
                          JSON.stringify({
                            for: 'game',
                            type: 'end_turn',
                            userIdCurrentTurn: getNextPlayer(
                              roomSet,
                              currentUserIndex,
                            ),
                            newPlayersPositions,
                          }),
                        )
                      })
                    }
                  }
                }
              }
            }
          }
          // Caso a sala esteja vazia, é feita o delete da sala da lista de sockets e do banco
          if (roomSet.length === 0) {
            roomConnections.delete(roomId)
            await prisma.room.deleteMany({
              where: {
                id: roomId,
              },
            })
          }
        }
      })
    },
  )
}
