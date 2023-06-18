import Header from "@/components/Header";
import { useRoom } from "@/contexts/roomContext";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";

export default function Room() {
  const { roomId, joinRoom } = useRoom()
  const router = useRouter()
  const { slug } = router.query as { slug: string }

  useEffect(() => {
    if (!roomId) {
      if (slug) joinRoom(slug)
      else Router.push('/')
    }
  }, [joinRoom, roomId, slug])

  return (
    <main>
      <Header leave />
      <h1>Room {roomId}</h1>


    </main>
  )
}