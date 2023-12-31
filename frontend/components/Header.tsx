import Link from "next/link";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import LeaveRoom from "./LeaveRoom";
import CopyCodeRoom from "./CopyCodeRoom";
import StartGame from "./StartGame";

interface HeaderProps {
  leave?: boolean
  gameStarted?: boolean
  fixed?: boolean
}
// Componente Header que possui estados diferentes baseado em variáveis
export default function Header({ leave, gameStarted, fixed }: HeaderProps) {
  return (
    <header className={`flex w-full ${fixed ? "fixed" : null} h-[10vh] justify-between items-center px-8 py-6 border-b-2 bg-gray-900 border-gray-50 z-10`}>
      <Link href="/" className="text-4xl ">Corrida no Tabuleiro - Redes </Link>
      <div className="flex items-center justify-center gap-2">
        {/* Validação de botões a serem mostrados no componente */}
        {leave ? (
          <>
            {!gameStarted && (
              <>
                <StartGame />
                <CopyCodeRoom />
              </>
            )}
            <LeaveRoom />
          </>
        ) :
          (
            <>
              <CreateRoom />
              <JoinRoom />
            </>
          )}
      </div>
    </header>
  )
}