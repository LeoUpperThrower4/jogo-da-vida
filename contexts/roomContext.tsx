import { createContext, useContext } from "react"

interface RoomContextData {
  roomId: string
  createRoom: () => void
  joinRoom: (roomId: string) => void
}

export const RoomContext = createContext<RoomContextData>({createRoom: () => {}, joinRoom: () => {}, roomId: ''})

interface RoomProviderProps {
  children: React.ReactNode
}

export function RoomProvider({children}: RoomProviderProps) {
  function createRoom() {
    console.log('create room')
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