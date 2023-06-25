import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from 'react'
import { useRoom } from './roomContext'

export type ChatMessage = {
  id: number
  userId: number
  content: string
  type: string
  username?: string
}

type ChatMessagesContextType = {
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
}

const ChatMessagesContext = createContext<ChatMessagesContextType>({
  messages: [],
  addMessage: () => { },
})

interface ChatMessagesContextProviderProps {
  children: ReactNode
}

const ChatMessagesProvider = ({
  children,
}: ChatMessagesContextProviderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([] as ChatMessage[])
  const { roomId } = useRoom()

  useEffect(() => {
    if (!roomId) setMessages([])
  }, [roomId])


  function addMessage(msg: ChatMessage) {
    setMessages((prev) => [...prev, msg])
  }

  return (
    <ChatMessagesContext.Provider value={{ addMessage, messages }}>
      {children}
    </ChatMessagesContext.Provider>
  )
}

function useMessages() {
  const context = useContext(ChatMessagesContext)
  if (context === undefined) {
    throw new Error('useMessages must be used within a ChatMessagesContext')
  }
  return context
}

export { ChatMessagesProvider, ChatMessagesContext, useMessages }
