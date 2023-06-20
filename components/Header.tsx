import Link from "next/link";
import { useRoom } from "@/contexts/roomContext";
import Router from "next/router";
import { useWebSocket } from "@/contexts/websocketsContext";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import LeaveRoom from "./LeaveRoom";
import CopyCodeRoom from "./CopyCodeRoom";
import StartGame from "./StartGame";

interface HeaderProps {
  leave?: boolean
  gameStarted?: boolean
}

export default function Header({ leave, gameStarted }: HeaderProps) {
  return (
    <>
      <header className="flex justify-between items-center px-8 py-6 border-b">
        <Link href="/" className="text-2xl font-mono ">O Jogo Da Vida <span className="text-xs">(trabalho de redes usando websockets)</span></Link>
        <div className="flex items-center justify-center gap-2">
          {leave ? (
            <>
              <LeaveRoom />
              {!gameStarted && (
                <>
                  <CopyCodeRoom />
                  <StartGame />
                </>
              )}
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

    </>
  )
}