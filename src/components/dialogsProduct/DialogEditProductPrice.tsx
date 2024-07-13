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
import formatPrice from "@/utils/formatPrice";

interface ProductPutValues {
  PRODUCT_PRICE: number;
}

interface DialogEditProductPrice {
  productId: string;
  authToken: string | null;
}

export default function DialogEditProductPrice({ productId, authToken }: DialogEditProductPrice) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaProductPut),
    defaultValues: { PRODUCT_PRICE: 0 }
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
        title: "Preço atualizado",
        description: "O preço do produto foi atualizado com sucesso."
      });
    }
  }, [error, isUpdated]);

  if (isUpdating) {
    return <Loading />;
  }

  if (isUpdated) {
    return (
      <DialogContent onCloseAutoFocus={() => { window.location.reload() }} className="w-[28rem] max-w-[90vw]">
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
        <DialogTitle className="text-center">Editar preço</DialogTitle>
        <DialogDescription className="text-center">
          Digite o novo preço e aperte em salvar para concluir.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <div className="grid gap-4 pb-4">
            <FormField
              control={form.control}
              name="PRODUCT_PRICE"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço do produto</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      value={formatPrice(field.value)}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^\d]/g, '');
                        field.onChange(Number(rawValue) / 100);
                      }}
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