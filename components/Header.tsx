import Link from "next/link";
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRoom } from "@/contexts/roomContext";
import Router from "next/router";
import { useWebSocket } from "@/contexts/websocketsContext";

interface HeaderProps {
  leave?: boolean
}

export default function Header({ leave }: HeaderProps) {
  const [joinRoomModalOpen, setJoinRoomModalOpen] = useState(false)
  const [createRoomModalOpen, setCreateRoomModalOpen] = useState(false)

  const [username, setUsername] = useState('')
  const [roomId, setRoomId] = useState('')

  const { createRoom, leaveRoom } = useRoom()
  const { endConnection } = useWebSocket()

  async function createRoomAndCloseModal() {
    setCreateRoomModalOpen(false)
    const newRoomId = await createRoom(username)
    if (!newRoomId) return
    Router.push(`/room/${newRoomId.roomId}`)
  }

  function handleLeaveClick() {
    leaveRoom()
    endConnection()
    Router.push('/')
  }

  return (
    <>
      <header className="flex justify-between items-center px-8 py-6 border-b">
        <Link href="/">Logo</Link>
        <div className="flex items-center justify-center gap-2">
          {leave ? (
            <button className="p-2 border rounded" onClick={handleLeaveClick}>Sair da sala</button>
          ) : 
          (
            <>
              <button className="p-2 border rounded" onClick={() => setCreateRoomModalOpen(true)}>Criar sala</button>
              <button className="p-2 border rounded" onClick={() => setJoinRoomModalOpen(true)}>Entrar em uma sala</button>
            </>
          )}
        </div>
      </header>
      <Transition.Root show={joinRoomModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setJoinRoomModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    Entre em uma sala
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Digite o código da sala que você deseja entrar.
                    </p>
                  </div>
                  <div className="flex flex-col my-4 text-black gap-1 h-full">
                  <input placeholder="seu nome" className="border border-gray-800 px-2 py-1 rounded text-black" type="text" name="username" id="username" />
                  <input placeholder="id da sala" className="border border-gray-800 px-2 py-1 rounded text-black" type="text" name="roomId" id="roomId" />
                  </div>
                  <button type="submit" className="ml-auto px-2 py-1 flex border border-gray-800 rounded flex-1 items-center justify-center text-gray-950">Entrar</button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <Transition.Root show={createRoomModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setCreateRoomModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                    Crie uma sala
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Digite o seu nome
                    </p>
                  </div>
                  <div className="flex flex-col my-4 text-black gap-1 h-full">
                    <input placeholder="seu nome" onChange={(e) => setUsername(e.target.value)} className="border border-gray-800 px-2 py-1 rounded text-black" type="text" name="username" id="username" />
                  </div>
                  <button type="submit" className="ml-auto px-2 py-1 flex border border-gray-800 rounded flex-1 items-center justify-center text-gray-950"
                  onClick={createRoomAndCloseModal}
                  >Criar</button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>      
    </>
  )
}