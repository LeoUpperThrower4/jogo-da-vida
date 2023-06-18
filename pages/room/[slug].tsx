import Header from "@/components/Header";
import { useRouter } from "next/router";

export default function Room() {
  const router = useRouter()
  const { slug: roomId } = router.query
  return (
    <main>
      <Header />
    </main>
  )
}