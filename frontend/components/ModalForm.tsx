import { Dialog, Transition } from '@headlessui/react'
import React, { FormEvent, Fragment, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { ErrorMessage } from './ErrorMessage';
import Button from './Button';

interface Field {
  name: string
  label: string
  placeholder: string
  type: string
}
interface ModalFormProps {
  title: string
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  fields: Field[]
  buttonTitle: string
  isOpen: boolean
  closeModal: () => void
}
//Component Modal
export default function ModalForm({ title, onSubmit, fields, buttonTitle, isOpen, closeModal }: ModalFormProps) {
  const { register } = useFormContext()

  return (
    <>
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
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-50 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-800"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      id="form"
                      onSubmit={onSubmit}
                    >
                      {fields.map(field => {
                        return (
                          <React.Fragment key={field.name}>
                            < div className="sm:col-span-4 mt-2">
                              <label
                                htmlFor={field.name}
                                className="block text-normal leading-6 text-gray-800"
                              >
                                {field.label}
                              </label>
                              <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-500 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-500 sm:max-w-md">
                                  <input
                                    type={field.type}
                                    id={field.name}
                                    autoComplete={field.name}
                                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-800 placeholder:text-gray-900 placeholder:opacity-50 focus:ring-0 sm:text-sm sm:leading-6"
                                    placeholder={field.placeholder}
                                    {...register(field.name)}
                                  />
                                </div>
                              </div>
                            </div>
                            <ErrorMessage field={field.name} />
                          </React.Fragment>)
                      })}
                    </form>
                  </div>

                  <div className="flex mt-4  justify-center">
                    <Button
                      type="submit"
                      form="form"
                      variant='secondary'
                    >
                      {buttonTitle}
                    </Button>

                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div >
        </Dialog >
      </Transition >
    </>
  )
}
