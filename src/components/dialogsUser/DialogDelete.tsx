import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaUserPut } from "@/schemas/schemaUserPut";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import Loading from "../ui/loading";
import { CircleCheck } from "lucide-react";
import useDelete from "@/hooks/useDelete";

interface UserPutValues {
  USER_DELETED?: boolean;
}

interface DialogEditNameProps {
  userId: string;
  authToken: string | null;
}

export default function DialogDelete({ userId, authToken }: DialogEditNameProps) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaUserPut),
  });

  const [isDelete, setIsDelete] = useState(false);
  const { isDeleted, isDeleting, error } = useDelete(`${process.env.NEXT_PUBLIC_BASE_URL}/user/delete/${userId}`, isDelete, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<UserPutValues> = () => {
    setIsDelete(true);
  };

  useEffect(() => {
    if (error) {
      setIsDelete(false)
      toast({
        title: error.error,
        description: error.message
      });
    }
    if (isDeleted) {
      setIsDelete(false)
      toast({
        title: "Conta desativada",
        description: "Sua conta foi desativada, nós sentiremos sua falta."
      });
    }
  }, [error, isDeleted]);

  if (isDeleted) {
    return (
      <DialogContent onCloseAutoFocus={() => { window.location.href = '/painel' }} className="w-[28rem] max-w-[90vw]">
        <DialogHeader>
          <div className="flex justify-center p-4">
            <CircleCheck size={60} color="#15ba12" />
          </div>
          <DialogTitle className="text-center">Conta desativada com sucesso</DialogTitle>
          <DialogDescription className="text-center">
            Desfaça a desativação a qualquer momento.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="w-[28rem] max-w-[90vw]">
      <DialogHeader>
        <DialogTitle className="text-center">Desativar conta temporariamente?</DialogTitle>
        <DialogDescription className="text-center">
          A desativação temporaria de conta não deleta, a desativação pode ser desfeita a qualquer momento!
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <DialogFooter>
            <Button className="w-full" variant='destructive' type="submit">Desativar minha conta</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}