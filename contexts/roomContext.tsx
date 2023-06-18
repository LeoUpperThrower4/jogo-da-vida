import { api } from "@/services/api"
import { createContext, useContext } from "react"

interface RoomContextData {
  roomId: string
  createRoom: (owner: string) => Promise<CreateRoomResponse> | void
  joinRoom: (roomId: string) => void
}

export const RoomContext = createContext<RoomContextData>({createRoom: () => {}, joinRoom: () => {}, roomId: ''})

interface RoomProviderProps {
  children: React.ReactNode
}

interface CreateRoomResponse {
  roomId: string
}

export function RoomProvider({children}: RoomProviderProps) {
  async function createRoom(owner: string) {
    console.log('create room for: ', owner)
    const response = await api.post(`/room`, { username: owner })
    if (response.status !== 201) {
      console.log('error creating room')
      return
    }
    return response.data
  }

  function joinRoom(roomId: string) {
    console.log('join room', roomId)
  }

  return (
    <RoomContext.Provider value={{createRoom, joinRoom, roomId: ''}}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  return useContext(RoomContext)
}