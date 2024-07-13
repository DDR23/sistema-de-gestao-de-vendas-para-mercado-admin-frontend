import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaUserPut } from "@/schemas/schemaUserPut";
import { useEffect, useState } from "react";
import usePut from "@/hooks/usePut";
import { toast } from "../ui/use-toast";
import { CircleCheck } from "lucide-react";

interface UserPutValues {
  USER_NAME?: string;
}

interface DialogEditNameProps {
  userId: string;
  authToken: string | null;
}

export default function DialogEditNome({ userId, authToken }: DialogEditNameProps) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaUserPut),
    defaultValues: { USER_NAME: '' }
  });

  const [data, setData] = useState<UserPutValues>({});
  const [posted, setPosted] = useState(false);
  const { isUpdated, isUpdating, error } = usePut(`${process.env.NEXT_PUBLIC_BASE_URL}/user/edit/${userId}`, data, posted, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<UserPutValues> = (formData) => {
    setData(formData);
    setPosted(true);
  };

  useEffect(() => {
    if (error) {
      setPosted(false)
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
    }
  }, [error, isUpdated]);

  if (isUpdated) {
    return (
      <DialogContent onCloseAutoFocus={() => { window.location.reload()}} className="w-[28rem] max-w-[90vw]">
        <DialogHeader>
          <div className="flex justify-center p-4">
            <CircleCheck size={60} color="#15ba12" />
          </div>
          <DialogTitle className="text-center">Sucesso</DialogTitle>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="w-[28rem] max-w-[90vw]">
      <DialogHeader>
        <DialogTitle className="text-center">Editar nome</DialogTitle>
        <DialogDescription className="text-center">
          Digite um novo nome e aperte em salvar para concluir.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <div className="grid gap-4 pb-4">
            <FormField
              control={form.control}
              name="USER_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o novo nome" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}