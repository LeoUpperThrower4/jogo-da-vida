
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Router from "next/router";
import { useRoom } from '@/contexts/roomContext'
import Button from './Button'
import ModalForm from './ModalForm'

const CreateRoomFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'O usuário precisa ter pelo menos 3 letras.' }),
})

type CreateRoomFormData = z.infer<typeof CreateRoomFormSchema>

export default function CreateRoom() {
  const { createRoom } = useRoom()
  const [isOpen, setIsOpen] = useState(false)
  function closeModal() {
    setIsOpen(false)
  }
  function openModal() {
    setIsOpen(true)
  }

  const CreateRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(CreateRoomFormSchema),
  })
  const { handleSubmit } = CreateRoomForm

  async function handleCreateRoom(data: CreateRoomFormData) {
    const { username } = data
    const newRoom = await createRoom(username)
    closeModal()
    if (newRoom === true) Router.push(`/room`)
    else alert(newRoom)
  }

  const fields = [{ name: 'username', label: 'Nome de usuário', type: 'string', placeholder: 'Seu nome' }]

  return (
    <>
      <FormProvider {...CreateRoomForm}>
        <Button onClick={openModal} variant={"primary"} type="button"  >Criar Sala</Button>
        <ModalForm title={"Criar Sala"} onSubmit={handleSubmit(handleCreateRoom)} fields={fields} buttonTitle={"Criar"} isOpen={isOpen} closeModal={closeModal} />
      </FormProvider >
    </>
  )
}
