import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Router from "next/router";
import { useRoom } from '@/contexts/roomContext'
import Button from './Button'
import ModalForm from './ModalForm'

// Validação do formulário do componente
const JoinRoomFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' }),
  roomId: z.string().uuid({ message: 'Não é um id de sala válido' }),
})

type JoinRoomFormData = z.infer<typeof JoinRoomFormSchema>

//Component JoinRoom
export default function JoinRoom() {
  const { joinRoom } = useRoom()
  const [isOpen, setIsOpen] = useState(false)
  function closeModal() {
    setIsOpen(false)
  }
  function openModal() {
    setIsOpen(true)
  }
  // Validação com useForm
  const JoinRoomForm = useForm<JoinRoomFormData>({
    resolver: zodResolver(JoinRoomFormSchema)
  })
  const { handleSubmit, } = JoinRoomForm;

  //Função para entrar na sala
  async function handleJoinRoomClick(data: JoinRoomFormData) {
    closeModal()
    const { username, roomId } = data
    const joinedRoom = await joinRoom(username, roomId)
    if (joinedRoom === true) Router.push(`/room`)
    else alert(joinedRoom)
  }

  const fields = [{ name: 'username', label: 'Nome de usuário', type: 'string', placeholder: 'Seu nome...' }, { name: 'roomId', label: 'Id da sala', type: 'string', placeholder: '5fb1b384-8745-4a7e-8f53-c4603b29b7da' }]

  return (
    <>
      <FormProvider {...JoinRoomForm}>
        <Button onClick={openModal} variant={"primary"} type="button" >Entrar em uma sala</Button>
        <ModalForm title={"Entrar na Sala"} onSubmit={handleSubmit(handleJoinRoomClick)} fields={fields} buttonTitle={"Entrar"} isOpen={isOpen} closeModal={closeModal} />
      </FormProvider>
    </>
  )
}
