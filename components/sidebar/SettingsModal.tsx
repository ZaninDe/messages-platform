/* eslint-disable @typescript-eslint/no-explicit-any */
'use clint'
import { User } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '../ui/input'
import Image from 'next/image'
import { CldUploadButton } from 'next-cloudinary'
import { Button } from '../ui/button'

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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
          <DialogDescription>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-12 relative z-10">
                <div className="border-b border-gray-900/10 pb-12">
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Edit your public information.
                  </p>

                  <div className="mt-10 flex flex-col gap-8">
                    <input
                      disabled={isLoading}
                      className="h-8 px-2 focus:ring-1 ring-black outline-none rounded-sm"
                      placeholder="Name"
                      id="name"
                      {...register('name', { required: true, maxLength: 50 })}
                    />
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
                          className="relative z-50"
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
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsModal
