import { useRoom } from "@/contexts/roomContext";

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
    <button
      className="transition-all p-2 border bg-gray-300 text-gray-900 border-white rounded hover:opacity-70"
      onClick={handleCopyCodeClick}
    >
      Copiar código da sala
    </button>
  )
}