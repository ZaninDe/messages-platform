/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { Input } from '@/components/ui/input'
import Select from '@/components/Select'
import { Button } from '@/components/ui/button'

interface GroupChatModalProps {
  users: User[]
  isOpen: boolean
  onClose: () => void
}

const GroupChatModal = ({ users, isOpen, onClose }: GroupChatModalProps) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: [],
    },
  })

  const members = watch('members')

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true)

    axios
      .post('/api/conversations', {
        ...data,
        isGroup: true,
      })
      .then(() => {
        router.refresh()
        onClose()
      })
      .catch(() => toast.error('Something went wrong'))
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
                <div className="space-y-12">
                  <div className="border-b border-gray-900/10 pb-12">
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Create a chat with more than 2 people
                    </p>
                    <div className="mt-10 flex flex-col gap-y-8">
                      <Input
                        id="name"
                        {...register('name', {
                          required: true,
                          maxLength: 50,
                        })}
                        placeholder="Name"
                      />
                      <Select
                        disabled={isLoading}
                        label="Members"
                        options={users.map((user) => ({
                          value: user.id,
                          label: user.name,
                        }))}
                        onChange={(value: any) =>
                          setValue('members', value, {
                            shouldValidate: true,
                          })
                        }
                        value={members}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-end gap-x-6">
                  <Button
                    disabled={isLoading}
                    onClick={onClose}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button disabled={isLoading} type="submit">
                    Create
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupChatModal
