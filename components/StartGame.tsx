import { useRoom } from "@/contexts/roomContext";
import { useWebSocket } from "@/contexts/websocketsContext";

export default function StartGame() {
  const { roomId: currentRoomId } = useRoom()
  const { emitGameStart } = useWebSocket()

  return (
    <button className="p-2 border rounded bg-indigo-700" onClick={emitGameStart}>
      Iniciar jogo
    </button>
  )
}