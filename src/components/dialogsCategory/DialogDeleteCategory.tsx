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

interface CategoryPutValues {
  CATEGORY_DELETED?: boolean;
}

export default function DialogDeleteCategory(categoryId: any) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaUserPut),
  });

  const catId = categoryId?.categoryId;

  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
  }, []);

  const [isDelete, setIsDelete] = useState(false);
  const { isDeleted, isDeleting, error } = useDelete(`${process.env.NEXT_PUBLIC_BASE_URL}/category/delete/${catId}`, isDelete, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<CategoryPutValues> = () => {
    setIsDelete(true);
  };

  useEffect(() => {
    if (error) {
      setIsDelete(false)
      toast({
        title: 'Erro ao deletar',
        description: 'Verifique se a categoria já está marcado como indisponivel'
      });
    }
    if (isDeleted) {
      setIsDelete(false)
      toast({
        title: "Categoria deletada",
        description: "A categoria foi apagada com sucesso."
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
          <DialogTitle className="text-center">Categoria marcada como indisponível</DialogTitle>
          <DialogDescription className="text-center">
            Esta categoria não está mais disponivel para cadastro de novos produtos, a marcação pode ser desfeita a qualquer momento em editar.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="w-[28rem] max-w-[90vw]">
      <DialogHeader>
        <DialogTitle className="text-center">Deletar esta categoria?</DialogTitle>
        <DialogDescription className="text-center">
          A categoria receberá uma marcação de indispinível e deixará de ser visivel ao criar ou editar novos produtos, dessa forma ele não é apagado do banco e pode ser recuperada editando o status para disponivel.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <DialogFooter>
            <Button className="w-full" variant='destructive' type="submit">Deletar Categoria</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}