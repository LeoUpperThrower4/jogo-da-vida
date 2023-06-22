import { useRoom } from "@/contexts/roomContext";
import Button from "./Button";

export default function CopyCodeRoom() {
  const { roomId: currentRoomId } = useRoom()

  async function handleCopyCodeClick() {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(currentRoomId);
        alert('Código da sala copiado!');
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Erro ao copiar o código da sala. Tente novamente.');
    }
  }

  return (


    <Button onClick={handleCopyCodeClick} variant={"secondary"} type="button">Copiar código da sala</Button>
  )
}