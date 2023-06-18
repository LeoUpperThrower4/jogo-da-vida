import Header from "@/components/Header";
import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";
import Router from "next/router";
import { useEffect } from "react";

export default function Room() {
  const { roomId } = useRoom()
  const { getConnectionForRoom, createConnection } = useWebSocket()

  let socket = getConnectionForRoom(roomId)
  if (!socket) socket = createConnection(roomId)

  useEffect(() => {
    if (!roomId) Router.push('/')
  }, [roomId])

  return (
    <main>
      <Header leave />
      <h1>Room {roomId}</h1>


    </main>
  )
}