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
import { schemaTransactionPut } from "@/schemas/schemaTransactionPut";

interface TransacoesPutValues {
  CART_STATUS?: 'active' | 'completed' | 'canceled';
}

export default function DialogFinalizarCompra({ compraId }: any) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaTransactionPut)
  });
  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
  }, [])

  const [posted, setPosted] = useState(false);
  const { isUpdated, isUpdating, error } = usePut(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/edit/${compraId}`, {CART_STATUS: 'completed'}, posted, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<TransacoesPutValues> = () => {
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
        title: "Compra concluida",
        description: "Esta compra foi concluida com sucesso."
      });
    }
  }, [error, isUpdated]);

  if (isUpdating) {
    return (
      <DialogContent onCloseAutoFocus={() => { window.location.reload()}} className="w-[28rem] max-w-[90vw]">
        <Loading />
      </DialogContent>
    );
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
        <DialogTitle className="text-center">Finalizar compra</DialogTitle>
        <DialogDescription className="text-center">
          Antes de concluir esta compra verifique se o valor total foi recebido corretamente 
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <DialogFooter>
            <Button className="w-full" type="submit">Confirmar recebimento</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}