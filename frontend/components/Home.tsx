import Image from "next/image";
import Team from "./Team";
import { Icon } from '@iconify/react';
export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="relative isolate pt-[15vh]">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="">
          <div className="mx-auto max-w-full px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Corrida no tabuleiro
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Um jogo para testar sua sorte e habilidade contra seus amigos!
              </p>
            </div>
            <div className="flex mt-[10vh] items-center justify-around">
              <section className="flex flex-col gap-12 text-xl max-w-2xl">
                <h1 className="text-5xl font-bold">
                  Teste sua sorte nessa corrida contra seus amigos !
                </h1>
                <div className="flex flex-col gap-8">

                  <h3 className="font-semibold text-4xl ">Instruções</h3>
                  <p className="pl-6">
                    Após criar uma sala ou acessando-a através de um ID já
                    existente, os jogadores têm a opção de iniciar a partida, um
                    jogador sorteado aleatoriamente, pode lançar o dado e verificar
                    no tabuleiro sua posição e se sua jogada foi vantajosa ou não,
                    passando a vez ao próximo jogador.
                  </p>



                </div>
              </section>
              <div className="w-auto">
                <Image src="/foto_tabu.png" width={700} height={500} alt="" className="object-cover animate-float" />
              </div>

            </div>
            <div className="flex flex-col gap-10 items-center justify-around mt-[10vh]">
              <div className="mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Tecnologias</h2>
              </div>
              <ul className="flex flex-wrap gap-8 justify-center text-8xl ">
                <li className='flex flex-col items-center gap-2 '><Icon icon="vscode-icons:file-type-node" /><span className="text-2xl">Node.js</span></li>
                <li className='flex flex-col items-center gap-2'><Icon icon="simple-icons:fastify" /><span className="text-2xl">Fastify</span></li>
                <li className='flex flex-col items-center gap-2'><Icon icon="logos:react" /><span className="text-2xl">React.js</span></li>
                <li className='flex flex-col items-center gap-2'><Icon icon="nonicons:next-16" /><span className="text-2xl">Next.js</span></li>
                <li className='flex flex-col items-center gap-2'><Icon icon="devicon:tailwindcss" /><span className="text-2xl">Tailwind</span></li>
                <li className='flex flex-col items-center gap-2'><Icon icon="logos:websocket" /><span className="text-2xl">Websockets</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>
      <Team />
    </main>
  )
}