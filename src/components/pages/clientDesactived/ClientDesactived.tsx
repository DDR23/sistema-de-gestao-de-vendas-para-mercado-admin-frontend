import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { CircleUser } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaUserPut } from "@/schemas/schemaUserPut";
import usePut from "@/hooks/usePut";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import Loading from "@/components/ui/loading";

interface UserPutValues {
  USER_DELETED?: boolean;
}

interface ClientDesactivedProps {
  user: any;
  authToken: string | null
}

export default function ClientDesactived({ user, authToken }: ClientDesactivedProps) {
  const { logout } = useAuth();
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaUserPut),
  });

  const userId = user?._id
  const [posted, setPosted] = useState(false);
  const { isUpdated, isUpdating, error } = usePut(`${process.env.NEXT_PUBLIC_BASE_URL}/user/edit/${userId}`, {USER_DELETED: false}, posted, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<UserPutValues> = () => {
    setPosted(true);
  };

  useEffect(() => {
    setPosted(false)
    if (error) {
      toast({
        title: error.error,
        description: error.message
      });
    }
    if (isUpdated) {
      setPosted(false)
      toast({
        title: "Nome atualizado",
        description: "Seu nome foi atualizado com sucesso."
      });
      window.location.reload();
    }
  }, [error, isUpdated]);

  return (
    <div className="h-screen w-full flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
        <div className="w-full flex justify-end">
          <div className="flex items-center mr-2">
            Olá, {user?.USER_NAME}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.USER_EMAIL}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-center mb-5">Olá, {user?.USER_NAME}</CardTitle>
            <CardDescription className="text-center">
              Você faz falta por aqui, ficaremos felizes em te ter de volta!!!
            </CardDescription>
            <CardDescription className="text-center">
              Deseja ativar sua conta?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
              <div>
                <Button className="w-full" type="submit">Ativar minha conta</Button>
              </div>
            </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}