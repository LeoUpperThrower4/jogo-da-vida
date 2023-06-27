import Header from "@/components/Header";
import Home from "@/components/Home";
import Head from "next/head";

export default function Index() {
  return (
    <>
      <Head>
        <title>Corrida no Tabuleiro</title>
      </Head>
      <Header />
      <Home />
    </>
  )
}
