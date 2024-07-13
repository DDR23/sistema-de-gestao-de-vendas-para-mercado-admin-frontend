import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import DialogEditNome from "@/components/dialogsUser/DialogEditNome";
import DialogEditSenha from "@/components/dialogsUser/DialogEditSenha";
import DialogDelete from "@/components/dialogsUser/DialogDelete";

export default function PageConfiguracoes({ user }: any) {

  const [authToken, setAuthToken] = useState<string | null>(null);
  const userId = user?._id;

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Configurações</h1>
      </div>
      <div
        className="flex flex-1 flex-col gap-4 items-center justify-center rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center">
          <h1 className="text-lg text-center font-semibold md:text-2xl">Olá, {user?.USER_NAME}</h1>
          <p className="text-sm text-center text-muted-foreground md:inline">{user?.USER_EMAIL}</p>
        </div>
        <div style={{
          width: '30rem',
          maxWidth: '90vw'
        }}>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mb-3" variant="outline">Editar nome</Button>
            </DialogTrigger>
            <DialogEditNome userId={userId} authToken={authToken} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mb-3" variant="outline">Editar senha</Button>
            </DialogTrigger>
            <DialogEditSenha userId={userId} authToken={authToken} />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full mb-3" variant="destructive">Desativar minha conta</Button>
            </DialogTrigger>
            <DialogDelete userId={userId} authToken={authToken} />
          </Dialog>
        </div>
      </div>
    </main>
  )
}