/* eslint-disable @next/next/no-img-element */
export default function Home() {
  return (
    <main className="flex w-screen h-[90vh] p-10 gap-24 bg-white text-black">
      <div className="flex items-center w-screen justify-around">
        <section className="flex flex-col gap-24 text-xl max-w-2xl">
          <h1 className="text-4xl font-bold">
            Teste sua sorte nessa corrida contra seus amigos !
          </h1>
          <div className="flex flex-col gap-8">
            <details open>
              <summary className="font-semibold border-b border-black max-w-fit">Instruções</summary>
              <p className="pl-6">
                Após criar uma sala ou acessando-a através de um ID já
                existente, os jogadores têm a opção de iniciar a partida, um
                jogador sorteado aleatoriamente, pode lançar o dado e verificar
                no tabuleiro sua posição e se sua jogada foi vantajosa ou não,
                passando a vez ao próximo jogador.
              </p>
            </details>
            <details open>
              <summary className="font-semibold border-b border-black max-w-fit">
                Tecnologias Utilizadas
              </summary>
              <ul className="flex gap-6 pl-6">
                <li>Node.js</li>
                <li>Fastify</li>
                <li>React.js</li>
                <li>Next.js</li>
                <li>Tailwind</li>
                <li>Websockets</li>
              </ul>
            </details>
            <details open>
              <summary className="font-semibold border-b border-black max-w-fit">Integrantes</summary>
              <p className="ml-5">Leonardo dos Santos Duarte Silva</p>
              <p className="ml-5">Lucas Machado Avila</p>
              <p className="ml-5">Rafael Flores Coelho</p>
              <p className="ml-5">Rafael Huszcza Machado</p>
            </details>
          </div>
        </section>
        <div className="w-auto">
          <img src="/foto_tabu.png" alt="" className="object-cover animate-float" />
        </div>
      </div>
    </main>
  )
}
