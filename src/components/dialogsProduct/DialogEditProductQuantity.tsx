import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import usePut from "@/hooks/usePut";
import { toast } from "../ui/use-toast";
import Loading from "../ui/loading";
import { CircleCheck } from "lucide-react";
import { schemaProductPut } from "@/schemas/schemaProductPut";

interface ProductPutValues {
  PRODUCT_QUANTITY: number;
}

interface DialogEditProductQuantity {
  productId: string;
  authToken: string | null;
}

export default function DialogEditProductQuantity({ productId, authToken }: DialogEditProductQuantity) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaProductPut),
    defaultValues: { PRODUCT_QUANTITY: 0 }
  });

  const [data, setData] = useState<ProductPutValues>({} as ProductPutValues);
  const [posted, setPosted] = useState(false);
  const { isUpdated, isUpdating, error } = usePut(`${process.env.NEXT_PUBLIC_BASE_URL}/product/edit/${productId}`, data, posted, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<ProductPutValues> = (formData) => {
    setData(formData);
    setPosted(true);
  };

  useEffect(() => {
    if (error) {
      setPosted(false)
      toast({
        title: error?.error,
        description: error?.message
      });
    }
    if (isUpdated) {
      setPosted(false)
      toast({
        title: "Quantidade em estoque atualizada",
        description: "A quantidade do produto disponivel em estoque foi atualizado com sucesso."
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
        <DialogTitle className="text-center">Editar quantidade</DialogTitle>
        <DialogDescription className="text-center">
          Digite a quantidade e aperte em salvar para concluir.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <div className="grid gap-4 pb-4">
          <FormField
              control={form.control}
              name="PRODUCT_QUANTITY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade disponível</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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