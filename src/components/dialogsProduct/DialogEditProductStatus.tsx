import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import usePut from "@/hooks/usePut";
import { toast } from "../ui/use-toast";
import Loading from "../ui/loading";
import { CircleCheck } from "lucide-react";
import { schemaProductPut } from "@/schemas/schemaProductPut";

interface ProductPutValues {
  PRODUCT_DELETED?: boolean;
}

interface DialogEditProductStatus {
  productId: string;
  authToken: string | null;
  status: boolean;
}

export default function DialogEditProductStatus({ productId, authToken, status }: DialogEditProductStatus) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaProductPut)
  });

  const [posted, setPosted] = useState(false);
  const { isUpdated, isUpdating, error } = usePut(`${process.env.NEXT_PUBLIC_BASE_URL}/product/edit/${productId}`, {PRODUCT_DELETED: false}, posted, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<ProductPutValues> = () => {
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
        title: "Status atualizado",
        description: "O status do produto foi atualizado com sucesso."
      });
    }
  }, [error, isUpdated]);

  if (isUpdating) {
    return <Loading />;
  }

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
        <DialogTitle className="text-center">Editar status</DialogTitle>
        <DialogDescription className="text-center">
          Clicar no botão deixará o produto disponivel novamente.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <DialogFooter>
            <Button className="w-full" type="submit" disabled={status === false}>Mudar para disponivel</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}