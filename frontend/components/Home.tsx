/* eslint-disable @next/next/no-img-element */
import { Icon } from '@iconify/react';

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
              <summary className="font-semibold border-b border-black max-w-fit mb-2">
                Tecnologias Utilizadas
              </summary>
              <ul className="flex gap-6 pl-6">
                <li className='flex items-center gap-2 h-5 p-1'><Icon icon="vscode-icons:file-type-node" />Node.js</li>
                <li className='flex items-center gap-2 h-5 p-1'><Icon icon="simple-icons:fastify" />Fastify</li>
                <li className='flex items-center gap-2 h-5 p-1'><Icon icon="logos:react" />React.js</li>
                <li className='flex items-center gap-2 h-5 p-1'><Icon icon="nonicons:next-16" />Next.js</li>
                <li className='flex items-center gap-2 h-5 p-1'><Icon icon="devicon:tailwindcss" />Tailwind</li>
                <li className='flex items-center gap-2 h-5 p-1'><Icon icon="logos:websocket" />Websockets</li>
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
