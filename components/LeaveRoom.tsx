import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";
import Router from "next/router";

export default function LeaveRoom() {
  const { leaveRoom } = useRoom()
  const { endConnection } = useWebSocket()
  function handleLeaveClick() {
    endConnection()
    leaveRoom()
    Router.push('/')
  }
  return (
    <button className="p-2 border rounded" onClick={handleLeaveClick}>
      Sair da sala
    </button>
  )
}