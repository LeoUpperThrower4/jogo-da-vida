import { Chat } from "@/components/Chat";
import GameBoard from "@/components/GameBoard";
import Header from "@/components/Header";
import { useMessages } from "@/contexts/chatMessageContext";
import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";
import Router from "next/router";
import { useEffect, useState } from "react";

interface PlayerPosition {
  id: string
  x: number
  y: number
}

export default function Room() {
  const { roomId, userId } = useRoom()
  const { getConnectionForRoom, createConnection, setCurrentSocket, emitDiceRoll } = useWebSocket()
  const [diceValue, setDiceValue] = useState(-1)
  const [myTurn, setMyTurn] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const { addMessage } = useMessages()
  // TODO: isso deve ficar no servidor
  const [playersPositions, setPlayersPositions] = useState<PlayerPosition[]>([])

  useEffect(() => {
    if (!roomId) Router.push('/')
  }, [roomId])
  

  let socket = getConnectionForRoom(roomId)
  if (!socket) {
    socket = createConnection(roomId)
    if (socket) setCurrentSocket(socket)
  }
  if (!socket) return 'Carregando...'
  
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.for === 'chat') {
      addMessage({
        id: data.id,
        type: data.type,
        userId: data.userId,
        content: data.content,
      })
    } else if (data.for === 'game') {
      if (data.type === 'start_game') {
        setGameStarted(true)
        setMyTurn (data.userIdCurrentTurn === userId)
        const { playersIds } = data
        let initialPlayersPositions: PlayerPosition[] = []
        for (let i = 0; i < playersIds.length; i++) {
          initialPlayersPositions.push({id: playersIds[i], x: 0, y: 0})
        }
        setPlayersPositions(initialPlayersPositions)
      } else if (data.type === 'roll_dice') {
        setDiceValue(data.diceValue)
        // fazer isso no servidor?
        const newPlayersPositions = playersPositions.map((playerPosition) => {
          if (playerPosition.id === String(userId)) {
            let newX = playerPosition.x + data.diceValue
            let newY = playerPosition.y
            while (newX > 4) {
              newY = newY + 1
              newX = newX - 5
            }
              return {
                ...playerPosition,
                x: newX,
                y: newY,
              }
          }
          return playerPosition
        })
        setPlayersPositions(newPlayersPositions)
      } else if (data.type === 'end_turn') {
        setMyTurn(data.userIdCurrentTurn === userId)
      }
    }
  }

  function handleDiceClick() {
    if (!myTurn) return
    emitDiceRoll()
  }
  return (
    <>
      <Header leave gameStarted={gameStarted} />
      <main className="grid grid-cols-6 w-full h-full min-h-[24rem]">
        <div className="col-span-4 border">
          <GameBoard playersPositions={playersPositions} />
          {/* Dice */}
          { gameStarted && (
            <div className={`border-2 border-white bg-gray-500 rounded-full flex justify-center items-center absolute bottom-4 left-4 ${myTurn && 'animate-spin bg-green-300'}`}>
              <button 
                className={`p-2 text-2xl text-black text-center`}
                onClick={handleDiceClick}
              >
                {(myTurn) ? '🎲' : (
                  diceValue === -1 ? '❌' : diceValue
                )}
              </button>
            </div>
          )}
        </div>
        <div className="col-span-2">
          <Chat />
        </div>
      </main>
    </>
  )
}

