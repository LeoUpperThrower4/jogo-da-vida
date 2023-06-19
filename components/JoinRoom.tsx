import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Router from "next/router";
import { useRoom } from '@/contexts/roomContext'

const JoinRoomFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' }),
  roomId: z.string().uuid({ message: 'Não é um id de sala válido' }),
})

type JoinRoomFormData = z.infer<typeof JoinRoomFormSchema>


export default function JoinRoom() {
  const { joinRoom } = useRoom()
  const [isOpen, setIsOpen] = useState(false)
  function closeModal() {
    setIsOpen(false)
  }
  function openModal() {
    setIsOpen(true)
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinRoomFormData>({
    resolver: zodResolver(JoinRoomFormSchema)
  })

  async function handleJoinRoomClick(data: JoinRoomFormData) {
    closeModal()
    const { username, roomId } = data
    const joinedRoom = await joinRoom(username, roomId)
    if (joinedRoom === true) Router.push(`/room`)
    else alert(joinedRoom)
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="p-2 border rounded"
      >
        Entrar em uma sala
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className=" text-lg font-medium leading-6 text-gray-900"
                  >
                    Entrar na Sala
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      id="enterRoom"
                      onSubmit={handleSubmit(handleJoinRoomClick)}
                    >
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome de usuário
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-200 sm:max-w-md">
                            <input
                              type="text"
                              id="username"
                              autoComplete="username"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 placeholder:opacity-50 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="Rafael"
                              {...register('username')}
                            />
                          </div>
                        </div>
                      </div>

                      <span className="text-red-700">
                        {errors.username ? errors.username.message : null}{' '}
                      </span>
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="roomId"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Id da sala
                        </label>
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-200 sm:max-w-md">
                            <input
                              type="text"
                              autoComplete="roomId"
                              className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400  placeholder:opacity-50 focus:ring-0 sm:text-sm sm:leading-6"
                              placeholder="15d6fb4a-89f4-4842-a289-461e7a7ec56d"
                              {...register('roomId')}
                            />
                          </div>
                        </div>
                      </div>
                      <span className="text-red-700">
                        {errors.roomId ? errors.roomId.message : null}
                      </span>
                    </form>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      form="enterRoom"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      Entrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
