import React, { createContext, useContext, useState } from 'react'
import { useRoom } from './roomContext'

interface WebSocketContextValue {
  getConnectionForRoom: (roomId: string) => WebSocket | null
  createConnection: (roomId: string) => WebSocket | null
  setCurrentSocket: (socket: WebSocket) => void
  emitChatMessage: (content: string) => void
  emitGameStart: () => void
  emitDiceRoll: () => void
  endConnection: () => void
}

const WebSocketContext = createContext<WebSocketContextValue>({
  getConnectionForRoom: () => null,
  createConnection: () => null,
  setCurrentSocket: () => {},
  emitChatMessage: () => {},
  emitGameStart: () => {},
  emitDiceRoll: () => {},
  endConnection: () => {},
})

interface WebSocketProviderProps {
  children: React.ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [currentSocket, setCurrentSocket] = useState<WebSocket | null>(null)
  const { roomId: currentRoomId, userId } = useRoom()

  function getConnectionForRoom(roomId: string): WebSocket | null {
    if (!(currentRoomId && roomId)) return null
    if (roomId === currentRoomId && currentSocket) {
      return currentSocket
    } else {
      return null
    }
  }

  function emitChatMessage(content: string) {
    if (!currentSocket) return
    currentSocket.send(
      JSON.stringify({
        for: 'chat',
        type: 'message',
        content,
        userId
      })
    )
  }

  function emitGameStart() {
    if (!currentSocket) return
    currentSocket.send(
      JSON.stringify({
        for: 'game',
        type: 'start_game',
      })
    )
  }

  function emitDiceRoll() {
    if (!currentSocket) return
    currentSocket.send(
      JSON.stringify({
        for: 'game',
        type: 'roll_dice',
        userId
      })
    )
  }

  function createConnection(roomId: string): WebSocket | null {
    if (!roomId) return null
    const socket = new WebSocket(`ws://localhost:3333/room/${roomId}`)
    socket.onopen = () => {
      console.log('WebSocket connection established')
    }

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event)
    }
    return socket
  }

  function endConnection() {
    if (currentSocket) {
      currentSocket.close()
      setCurrentSocket(null)
    }
  }

  return (
    <WebSocketContext.Provider
      value={{
        getConnectionForRoom,
        setCurrentSocket,
        createConnection,
        emitChatMessage,
        emitGameStart,
        emitDiceRoll,
        endConnection,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  return useContext(WebSocketContext)
}
