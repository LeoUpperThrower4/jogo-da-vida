import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";
import Button from "./Button";

export default function StartGame() {
  const { emitGameStart } = useWebSocket()

  return (
    <Button onClick={emitGameStart} variant={"primary"} type="button">Iniciar jogo</Button>
  )
}