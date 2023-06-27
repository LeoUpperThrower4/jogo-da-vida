import { ChatMessagesProvider } from '@/contexts/chatMessageContext'
import { RoomProvider } from '@/contexts/roomContext'
import { WebSocketProvider } from '@/contexts/websocketsContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'], variable: '--font-roboto' })

// Criação do component main app, envolvendo os demais componentes pelos contextos ( variáveis acessíveis a todos componentes dentro)
export default function App({ Component, pageProps }: AppProps) {
  return (
    <RoomProvider>
      <WebSocketProvider>
        <ChatMessagesProvider>
          <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
          <ToastContainer />
          <main className={`${roboto.variable} font-sans bg-gray-900 text-gray-50`}>
            <Component {...pageProps} />
          </main>
        </ChatMessagesProvider>
      </WebSocketProvider>
    </RoomProvider>

  )
}
