import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";
import Router from "next/router";
import Button from "./Button";

export default function LeaveRoom() {
  const { leaveRoom } = useRoom()
  const { endConnection } = useWebSocket()
  function handleLeaveClick() {
    endConnection()
    leaveRoom()
    Router.push('/')
  }
  return (
    <Button onClick={handleLeaveClick} variant={"tertiary"} type="button">Sair da sala</Button>

  )
}