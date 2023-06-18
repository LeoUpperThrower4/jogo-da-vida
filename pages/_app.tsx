import { RoomProvider } from '@/contexts/roomContext'
import { WebSocketProvider } from '@/contexts/websocketsContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RoomProvider>
      <WebSocketProvider>
        <Component {...pageProps} />
      </WebSocketProvider>
    </RoomProvider>
  )
}
