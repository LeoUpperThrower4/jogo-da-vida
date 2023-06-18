import { Chat } from "@/components/Chat";
import Header from "@/components/Header";
import { useMessages } from "@/contexts/chatMessageContext";
import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";
import Router from "next/router";
import { useEffect } from "react";

export default function Room() {
  const { roomId } = useRoom()
  const { getConnectionForRoom, createConnection, setCurrentSocket } = useWebSocket()

  useEffect(() => {
    if (!roomId) Router.push('/')
  }, [roomId])
  
  const { addMessage } = useMessages()

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
    }
  }

  return (
    <main>
      <Header leave />
      <Chat />
    </main>
  )
}
