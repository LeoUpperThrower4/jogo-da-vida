import { api } from "@/services/api"
import { createContext, useContext, useState } from "react"

interface RoomContextData {
  roomId: string
  userId: number
  createRoom: (owner: string) => Promise<CreateRoomResponse> | void
  joinRoom: (username: string, roomId: string) => Promise<boolean> | void
  leaveRoom: () => void
}

export const RoomContext = createContext<RoomContextData>({createRoom: () => {}, joinRoom: () => {}, leaveRoom: () => {}, roomId: '', userId: -1})

interface RoomProviderProps {
  children: React.ReactNode
}

interface CreateRoomResponse {
  roomId: string
}

export function RoomProvider({children}: RoomProviderProps) {
  const [roomId, setRoomId] = useState('')
  const [userId, setUserId] = useState(-1)
  
  async function createRoom(owner: string) {
    try {
      const response = await api.post(`/room`, { username: owner })
      if (response.status !== 201) {
        console.log('error creating room')
        setRoomId('')
        setUserId(-1)
        return
      }
      setRoomId(response.data.roomId)
      setUserId(response.data.userId)
      return response.data
    } catch (error) {
      return
    }
  }

  async function joinRoom(username: string, roomId: string) {
    try {
      const response = await api.post(`/room/${roomId}/join`, { username })
      if (response.status !== 200) {
        console.log('error joining room')
        setRoomId('')
        setUserId(-1)
        return false
      }
      setRoomId(roomId)
      setUserId(response.data.userId)
      return true
    } catch (error) {
      return false
    }
  }

  async function leaveRoom() {
    setRoomId('')
  }

  return (
    <RoomContext.Provider value={{createRoom, joinRoom, leaveRoom, roomId, userId}}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  return useContext(RoomContext)
}