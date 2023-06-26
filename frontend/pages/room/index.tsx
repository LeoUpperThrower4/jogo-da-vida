import { Chat } from "@/components/Chat";
import GameBoard from "@/components/GameBoard";
import Header from "@/components/Header";
import { useMessages } from "@/contexts/chatMessageContext";
import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";
import Router from "next/router";
import { useEffect, useState } from "react";

interface BackendPlayerPosition {
  playerId: string
  positionX: number
  positionY: number
  roomId: string
}

interface PlayerPosition {
  id: string
  x: number
  y: number
}

export default function Room() {
  const { roomId, userId, } = useRoom()
  const { getConnectionForRoom, createConnection, setCurrentSocket, emitDiceRoll, endConnection } = useWebSocket()
  const [diceValue, setDiceValue] = useState(-1)
  const [myTurn, setMyTurn] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const { addMessage } = useMessages()
  const [playersPositions, setPlayersPositions] = useState<PlayerPosition[]>([])
  // const [myPlayerIndex, setMyPlayerIndex] = useState<number>(0)
  // const [indexSet, setIndexSet] = useState<boolean>(false)


  // useEffect(() => {
  //   if (indexSet === false && playersPositions.length !== 0) {
  //     setMyPlayerIndex(playersPositions.findIndex(player => player.id === userId))
  //     setIndexSet(true)
  //   }

  // }, [playersPositions, gameStarted, userId, indexSet])
  const myPlayerIndex = playersPositions.findIndex(player => player.id === userId)

  useEffect(() => {
    if (!roomId) Router.push('/')
    let socket = getConnectionForRoom(roomId)
    console.log(socket)
    if (socket === null) {
      socket = createConnection(roomId)
      console.log('Crating socket socket')
      if (socket) setCurrentSocket(socket)
    }
  }, [roomId, getConnectionForRoom, createConnection, setCurrentSocket])


  let socket = getConnectionForRoom(roomId)
  if (!socket) return 'Carregando...'

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.for === 'chat') {
      addMessage({
        id: data.id,
        type: data.type,
        userId: data.userId,
        content: data.content,
        username: data.username
      })
    } else if (data.for === 'game') {
      if (data.type === 'start_game') {
        setGameStarted(true)
        setMyTurn(data.userIdCurrentTurn === userId)
        const { playersIds } = data
        let initialPlayersPositions: PlayerPosition[] = []
        for (let i = 0; i < playersIds.length; i++) {
          initialPlayersPositions.push({ id: playersIds[i], x: 0, y: 0 })
        }
        setPlayersPositions(initialPlayersPositions)
      } else if (data.type === 'roll_dice') {
        setDiceValue(data.diceValue)
      } else if (data.type === 'end_turn') {
        console.log(data)
        setMyTurn(data.userIdCurrentTurn === userId)
        setPlayersPositions(data.newPlayersPositions.map((playerPosition: BackendPlayerPosition) => {
          return {
            id: playerPosition.playerId,
            x: playerPosition.positionX,
            y: playerPosition.positionY,
          }
        }
        ))
      } else if (data.type === 'end_game') {
        setGameStarted(false)
        setMyTurn(false)
        setPlayersPositions([])
        endConnection()
        if (data.winnerId === userId) alert('Você ganhou!')
        else alert('Você perdeu!')
      }
    }
  }

  function handleDiceClick() {
    if (!myTurn) return
    emitDiceRoll()
  }

  function paintPlayer(playerIndex: number) {
    if (playerIndex === 0) return 'bg-blue-500'
    if (playerIndex === 1) return 'bg-red-500'
    if (playerIndex === 2) return 'bg-green-500'
    if (playerIndex === 3) return 'bg-yellow-500'
    if (playerIndex === 4) return 'bg-white'
    if (playerIndex === 5) return 'bg-orange-500'
  }

  return (
    <>
      <Header leave gameStarted={gameStarted} />
      <main className="grid grid-cols-6 w-full h-full min-h-[24rem]">
        <div className=" pt-2 col-span-4">
          {gameStarted && (
            <div className="flex items-center p-2 gap-2">
              <span>Você é:</span> <div className={`w-2 h-2 rounded-full ${paintPlayer(myPlayerIndex)}`}></div>
            </div>
          )}
          <GameBoard playersPositions={playersPositions} />
          {/* Dice */}
          {gameStarted && (
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

