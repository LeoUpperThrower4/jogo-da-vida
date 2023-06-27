import Header from "@/components/Header";
import Home from "@/components/Home";
import Team from "@/components/Team";
import Head from "next/head";

export default function Index() {
  return (
    <div className="bg-gray-900">
      <Head>
        <title>Corrida no Tabuleiro</title>
      </Head>
      <Header fixed />
      <Home />

    </div>
  )
}
