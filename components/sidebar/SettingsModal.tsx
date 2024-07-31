/* eslint-disable @typescript-eslint/no-explicit-any */
'use clint'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import Image from 'next/image'
import { CldUploadButton } from 'next-cloudinary'
import { Button } from '../ui/button'
import { IoClose } from 'react-icons/io5'

interface SettingsModalProps {
  isOpen?: boolean
  onClose: () => void
  currentUser: User
}

const SettingsModal = ({
  isOpen,
  onClose,
  currentUser,
}: SettingsModalProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image,
    },
  })

  const image = watch('image')

  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true,
    })
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)
    axios
      .post('/api/settings', data)
      .then(() => {
        router.refresh()
        onClose()
      })
      .catch(() => toast.error('Something went wrong!'))
      .finally(() => setIsLoading(false))
  }
  return (
    <div>
      <div
        className="w-screen h-screen bg-black/80 fixed z-50 cursor-pointer"
        onClick={onClose}
      ></div>
      <div>
        <div className="flex justify-center items-center">
          {isOpen && (
            <div className="z-[51] max-w-[90%] w-96 bg-white p-6 rounded-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-1">
                  <button
                    type="button"
                    className="absolute top-3 right-3 text-gray-600 cursor-pointer"
                    onClick={onClose}
                  >
                    <IoClose />
                  </button>
                  <div className="border-b border-gray-900/10 pb-12 mb-12">
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Edit your public information.
                    </p>

                    <div className="mt-10 flex flex-col gap-8">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Name
                        </label>
                        <input
                          disabled={isLoading}
                          className="h-8 w-full px-2 mt-2 focus:ring-1 ring-black outline-none rounded-md border"
                          placeholder="Name"
                          id="name"
                          {...register('name', {
                            required: true,
                            maxLength: 50,
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                          Photo
                        </label>
                        <div className="mt-2 flex items-center gap-x-3">
                          <Image
                            alt="prfile image"
                            width={48}
                            height={48}
                            className="rounded-full"
                            src={
                              image ||
                              currentUser?.image ||
                              '/images/default_avatar.jpg'
                            }
                          />
                          <CldUploadButton
                            options={{ maxFiles: 1 }}
                            onSuccess={handleUpload}
                            uploadPreset="tsn2luo8"
                          >
                            <Button
                              variant="outline"
                              disabled={isLoading}
                              type="button"
                            >
                              Change
                            </Button>
                          </CldUploadButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-6 flex items-center justify-end gap-x-4">
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isLoading}
                      // onClick={onClose}
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
