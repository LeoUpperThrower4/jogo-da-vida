import { api } from "@/services/api"
import { createContext, useContext, useState } from "react"

interface RoomContextData {
  roomId: string
  createRoom: (owner: string) => Promise<CreateRoomResponse> | void
  joinRoom: (roomId: string) => Promise<boolean> | void
  leaveRoom: () => void
}

export const RoomContext = createContext<RoomContextData>({createRoom: () => {}, joinRoom: () => {}, leaveRoom: () => {}, roomId: ''})

interface RoomProviderProps {
  children: React.ReactNode
}

interface CreateRoomResponse {
  roomId: string
}

export function RoomProvider({children}: RoomProviderProps) {
  const [roomId, setRoomId] = useState('')
  async function createRoom(owner: string) {
    console.log('create room for: ', owner)
    try {
      const response = await api.post(`/room`, { username: owner })
      if (response.status !== 201) {
        console.log('error creating room')
        setRoomId('')
        return
      }
      setRoomId(response.data.roomId)
      return response.data
    } catch (error) {
      return
    }
  }

  async function joinRoom(roomId: string) {
    console.log('join room', roomId)
    try {
      const response = await api.post(`/room/${roomId}/join`)
      if (response.status !== 200) {
        console.log('error joining room')
        setRoomId('')
        return false
      }
      setRoomId(roomId)
      return true
    } catch (error) {
      return false
    }
  }

  async function leaveRoom() {
    setRoomId('')
  }

  return (
    <RoomContext.Provider value={{createRoom, joinRoom, leaveRoom, roomId}}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  return useContext(RoomContext)
}