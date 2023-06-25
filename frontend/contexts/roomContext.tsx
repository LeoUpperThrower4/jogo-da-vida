import { api } from "@/services/api"
import { createContext, useContext, useState } from "react"

interface RoomContextData {
  roomId: string
  userId: string
  createRoom: (owner: string) => Promise<boolean> | void
  joinRoom: (username: string, roomId: string) => Promise<boolean> | void
  leaveRoom: () => void
}

export const RoomContext = createContext<RoomContextData>({ createRoom: () => { }, joinRoom: () => { }, leaveRoom: () => { }, roomId: '', userId: '' })

interface RoomProviderProps {
  children: React.ReactNode
}


export function RoomProvider({ children }: RoomProviderProps) {
  const [roomId, setRoomId] = useState('')
  const [userId, setUserId] = useState('')

  async function createRoom(owner: string) {
    try {
      const response = await api.post(`/room`, { username: owner })
      setRoomId(response.data.roomId)
      setUserId(response.data.userId)

      return true
    } catch (error) {
      setRoomId('')
      setUserId('')
      return false
    }
  }

  async function joinRoom(username: string, roomId: string) {
    try {
      const response = await api.post(`/room/${roomId}/join`, { username })
      setRoomId(roomId)
      setUserId(response.data.userId)
      return true
    } catch (error) {
      setRoomId('')
      setUserId('')
      return error?.response?.data?.message
    }
  }

  async function leaveRoom() {
    setRoomId('')
  }

  return (
    <RoomContext.Provider value={{ createRoom, joinRoom, leaveRoom, roomId, userId }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  return useContext(RoomContext)
}