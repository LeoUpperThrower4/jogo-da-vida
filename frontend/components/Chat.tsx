import { useMessages } from '@/contexts/chatMessageContext'
import { useRoom } from '@/contexts/roomContext'
import { useWebSocket } from '@/contexts/websocketsContext'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'

export function Chat() {
  const [message, setMessage] = useState('')
  const { messages, addMessage } = useMessages()
  const { userId, roomId } = useRoom()
  const { emitChatMessage } = useWebSocket()
  function handleSendMessageSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    emitChatMessage(message)
    setMessage('')
  }

  useEffect(() => {
    if (!roomId) Router.push('/')
  }, [roomId])
  return (
    <div className="max-w-96 flex h-[90vh] flex-col justify-between  border-x-2 p-4">
      <div className="scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch flex flex-col space-y-4 overflow-y-auto p-3">
        {messages.map((message) => {
          return (
            <React.Fragment key={message.id}>
              {message.type === 'message' ? (

                (message.userId.toString() !== userId ? (
                  <div className="flex items-end">
                    <div className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
                      {message.username}
                      <span className="break-all inline-block rounded-lg rounded-bl-none bg-purple-800 px-4 py-2 text-gray-50">
                        {message.content}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end justify-end">
                    <div className="order-1 mx-2 flex max-w-xs flex-col items-end space-y-2 text-xs">
                      <span className="break-all inline-block rounded-lg rounded-br-none bg-blue-600 px-4 py-2 text-white ">
                        {message.content}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className=" flex flex-col items-center text-xs">
                  <p className={message.type === 'exit' ? 'text-red-500' : 'text-green-500'}>{message.userId}</p>
                  <p className={message.type === 'exit' ? 'text-red-500' : 'text-green-500'}>{message.content}</p>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div className="mb-2 border-t-2 border-gray-200 px-4 pt-4 sm:mb-0">
        <form
          className="relative flex"
          onSubmit={(e) => { handleSendMessageSubmit(e) }}
        >
          <input
            type="text"
            placeholder="Write your message!"
            className="w-full rounded-lg bg-gray-50 py-3 px-1 text-gray-900 placeholder-gray-600 focus:placeholder-gray-400 focus:outline-none"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            value={message}
          />
          <div className="absolute inset-y-0 right-0  items-center sm:flex">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-r-md bg-purple-800 px-4 py-3 font-bold text-white transition duration-500 ease-in-out hover:bg-purple-900 focus:outline-none"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
