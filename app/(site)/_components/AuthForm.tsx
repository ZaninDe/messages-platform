'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { isValid, z } from 'zod'

import { Button } from '@/components/ui/button'
import axios from 'axios'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { signIn, useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().min(2, {
    message: 'Email é obrigatório.',
  }),
  password: z.string().min(2, {
    message: 'Password é obrigatório.',
  }),
})

type Variant = 'LOGIN' | 'REGISTER'
const AuthForm = () => {
  const session = useSession()
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.push('/users')
    }
  }, [session?.status, router])

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER')
    } else {
      setVariant('LOGIN')
    }
  }, [variant])

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)

    console.log('ENTROU!!!')

    try {
      if (variant === 'REGISTER') {
        axios
          .post('/api/register', data)
          .then(() => signIn('credentials', data))
          .catch(() => toast.error('Something webt wrong'))
          .finally(() => setIsLoading(false))
      }

      if (variant === 'LOGIN') {
        signIn('credentials', {
          ...data,
          redirect: false,
        })
          .then((callback) => {
            if (callback?.error) {
              toast.error('Invalid credentials')
            }

            if (callback?.ok && !callback?.error) {
              toast.success('Logged in!')
            }
          })
          .finally(() => setIsLoading(false))
      }
    } catch (err) {
      console.log(err)
    }
  }

  const socialAction = (action: string) => {
    setIsLoading(true)

    signIn(action, {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid Credentials')
        }

        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!')
        }
      })
      .finally(() => setIsLoading(false))
  }
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white mx-2 md:mx-0 md:px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {variant === 'REGISTER' && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full"
            >
              {variant === 'LOGIN' ? 'Sign in' : 'Sign up'}
            </Button>
          </form>
        </Form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or Continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction('github')}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction('google')}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === 'LOGIN'
              ? 'New to Messenger?'
              : 'Already have an account?'}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm
