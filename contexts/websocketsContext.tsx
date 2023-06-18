import React, { createContext, useContext, useState } from 'react'
import { useRoom } from './roomContext'

interface WebSocketContextValue {
  getConnectionForRoom: (roomId: string) => WebSocket | null
  createConnection: (roomId: string) => WebSocket | null
  endConnection: () => void
}

const WebSocketContext = createContext<WebSocketContextValue>({
  getConnectionForRoom: () => null,
  createConnection: () => null,
  endConnection: () => {},
})

interface WebSocketProviderProps {
  children: React.ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [currentSocket, setCurrentSocket] = useState<WebSocket | null>(null)
  const { roomId: currentRoomId } = useRoom()

  function getConnectionForRoom(roomId: string): WebSocket | null {
    if (!(currentRoomId && roomId)) return null
    if (roomId === currentRoomId && currentSocket) {
      return currentSocket
    } else {
      return null
    }
  }

  function createConnection(roomId: string): WebSocket | null {
    if (!roomId) return null
    endConnection()
    const socket = new WebSocket(`ws://localhost:3333/room/${roomId}`)
    socket.onopen = () => {
      console.log('WebSocket connection established')
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)
      // Handle the received message as needed
      console.log('Received WebSocket message:', message)
      if (message.for === 'chat') {
        // Add the message to the chat messages context
        console.log('Adding message to chat messages context:', message)
      }
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
        createConnection,
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
