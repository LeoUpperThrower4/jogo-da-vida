import Header from "@/components/Header";
import Head from "next/head";

export default function Home() {
  return (
    <>

      <Head>
        <title>Jogo da Vida</title>
      </Head>
      <main>
        <Header />
        Explicação do jogo
      </main>
    </>
  )
}
