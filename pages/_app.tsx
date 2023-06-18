import { RoomProvider } from '@/contexts/roomContext'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RoomProvider>
      <Component {...pageProps} />
    </RoomProvider>
  )
}
