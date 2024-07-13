'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { schemaSignin } from "@/schemas/schemaSignin"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import usePost from "@/hooks/usePost"
import { toast } from "../ui/use-toast"
import Loading from "../ui/loading"
import Image from "next/image"

interface SigninFormValues {
  USER_EMAIL?: string;
  USER_PASSWORD?: string;
}

export default function SigninForm() {
  const { login } = useAuth();
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaSignin)
  })

  const [posted, setPosted] = useState(false);
  const [data, setData] = useState<SigninFormValues>({ USER_EMAIL: '', USER_PASSWORD: '' });

  const { token, isPosted, isPosting, error, error409 } = usePost<SigninFormValues>(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, data, posted);

  const submitForm: SubmitHandler<SigninFormValues> = (formData) => {
    setData(formData)
    setPosted(true)
  }

  useEffect(() => {
    if (error409) {
      setPosted(false)
      toast({
        title: error409.error,
        description: error409.message
      })
    }
    if (error) {
      setPosted(false)
      toast({
        title: error.error,
        description: error.message
      })
    }
    if (isPosted) {
      setPosted(false)
      const TokenUser = token?.token as string;
      const TokenAdmin = token?.tokenAdmin as string;
      if (!TokenAdmin) {
        toast({
          title: 'Acesso negado',
          description: 'Você não tem autorização para fazer o login'
        })
      } else {
        localStorage.setItem('token', TokenUser)
        localStorage.setItem('tokenAdmin', TokenAdmin)
        login()
      }
    }
  }, [error409, error, isPosted, token]);

  if (isPosting) {
    return <Loading />;
  }

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center">
      <Image src="/cabana-arbequina-light.png" width={200} height={200} alt="cabana arbeqina logo" />
      <Card style={{
        width: '30rem',
        maxWidth: '98vw',
        border: 'none'
      }}>
        <CardHeader>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>
            Digite seu e-mail abaixo para fazer login em sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
              <FormField
                control={form.control}
                name="USER_EMAIL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu@email.com"
                        type="email"
                        id="USER_EMAIL"
                        autoComplete="email"
                        {...field}
                        {...form.register('USER_EMAIL')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="USER_PASSWORD"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="sua senha"
                        type="password"
                        id="USER_PASSWORD"
                        autoComplete="current-password"
                        {...field}
                        {...form.register('USER_PASSWORD')}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Button className="w-full mt-4" type="submit">Entrar</Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Ainda não tem uma conta?{" "}
            <Link href="/signup" className="underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}