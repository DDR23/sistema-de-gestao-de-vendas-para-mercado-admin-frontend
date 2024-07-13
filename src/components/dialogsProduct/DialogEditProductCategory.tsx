import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import usePut from "@/hooks/usePut";
import { toast } from "../ui/use-toast";
import Loading from "../ui/loading";
import { CircleCheck } from "lucide-react";
import { schemaProductPut } from "@/schemas/schemaProductPut";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface ProductPutValues {
  PRODUCT_CATEGORY?: string;
}

interface DialogEditProductCategory {
  productId: string;
  authToken: string | null;
  category: any
}

export default function DialogEditProductCategory({ productId, authToken, category }: DialogEditProductCategory) {
  const form = useForm({
    mode: 'onBlur',
    resolver: zodResolver(schemaProductPut),
    defaultValues: { PRODUCT_CATEGORY: '' }
  });

  const [data, setData] = useState<ProductPutValues>({});
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
        title: error.error,
        description: error.message
      });
    }
    if (isUpdated) {
      setPosted(false)
      toast({
        title: "Categoria atualizada",
        description: "A categoria do produto foi atualizada com sucesso."
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
        <DialogTitle className="text-center">Editar categoria</DialogTitle>
        <DialogDescription className="text-center">
          Selecione a categoria e aperte em salvar para concluir.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <div className="grid gap-4 pb-4">
          <FormField
              control={form.control}
              name="PRODUCT_CATEGORY"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {category
                        .filter((categoria: any) => !categoria.CATEGORY_DELETED)
                        .map((categoria: any) => (
                          <SelectItem key={categoria._id} value={categoria._id}>{categoria.CATEGORY_NAME}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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