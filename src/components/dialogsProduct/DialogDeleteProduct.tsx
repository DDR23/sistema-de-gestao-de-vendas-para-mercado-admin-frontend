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
  PRODUCT_DELETED?: boolean;
}

export default function DialogDeleteProduct(productId: any) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaUserPut),
  });

  const prodId = productId?.productId;

  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
  }, []);

  const [isDelete, setIsDelete] = useState(false);
  const { isDeleted, isDeleting, error } = useDelete(`${process.env.NEXT_PUBLIC_BASE_URL}/product/delete/${prodId}`, isDelete, {
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
        title: 'Erro ao deletar',
        description: 'Verifique se o produto já está marcado como indisponivel'
      });
    }
    if (isDeleted) {
      setIsDelete(false)
      toast({
        title: "Produto deletado",
        description: "O produto foi apagado com sucesso."
      });
    }
  }, [error, isDeleted]);

  if (isDeleting) {
    return <Loading />;
  }

  if (isDeleted) {
    return (
      <DialogContent onCloseAutoFocus={() => { window.location.reload() }} className="w-[28rem] max-w-[90vw]">
        <DialogHeader>
          <div className="flex justify-center p-4">
            <CircleCheck size={60} color="#15ba12" />
          </div>
          <DialogTitle className="text-center">Produto marcado como indisponível</DialogTitle>
          <DialogDescription className="text-center">
            Este produto não está mais visivel para clientes, a marcação pode ser desfeita a qualquer momento em editar.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="w-[28rem] max-w-[90vw]">
      <DialogHeader>
        <DialogTitle className="text-center">Deletar este produto?</DialogTitle>
        <DialogDescription className="text-center">
          O produto receberá uma marcação de indispinível e deixará de ser visível para os clientes, dessa forma ele não é apagado do banco.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <DialogFooter>
            <Button className="w-full" variant='destructive' type="submit">Deletar produto</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}