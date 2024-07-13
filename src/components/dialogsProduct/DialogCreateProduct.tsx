import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaProductPost } from "@/schemas/schemaProductPost";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import useCreate from "@/hooks/useCreate";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import Loading from "../ui/loading";
import { CircleCheck } from "lucide-react";
import formatPrice from "@/utils/formatPrice";

interface ProductCreateValues {
  PRODUCT_NAME: string;
  PRODUCT_CATEGORY: string;
  PRODUCT_QUANTITY: number;
  PRODUCT_PRICE: number;
}

export default function DialogCreateProduct({ categorias }: any) {
  const form = useForm<ProductCreateValues>({
    mode: 'onBlur',
    resolver: zodResolver(schemaProductPost),
    defaultValues: {
      PRODUCT_NAME: '',
      PRODUCT_CATEGORY: '',
      PRODUCT_QUANTITY: 0,
      PRODUCT_PRICE: 0
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
  }, []);

  const [data, setData] = useState<ProductCreateValues>({} as ProductCreateValues);
  const [posted, setPosted] = useState(false);
  const { isPosted, isPosting, error, error409 } = useCreate(`${process.env.NEXT_PUBLIC_BASE_URL}/product/create`, data, posted, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<ProductCreateValues> = (formData) => {
    setData(formData);
    setPosted(true);
  };

  useEffect(() => {
    if (error409) {
      setPosted(false);
      toast({
        title: error409?.error,
        description: error409?.message
      });
    }
    if (error) {
      setPosted(false);
      toast({
        title: error.error,
        description: error.message
      });
    }
    if (isPosted) {
      setPosted(false);
      toast({
        title: "Produto cadastrado",
        description: "O produto foi criado com sucesso."
      });
    }
  }, [error, error409, isPosted]);

  if (isPosting) {
    return <Loading />;
  }

  if (isPosted) {
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
        <DialogTitle className="text-center">Novo produto</DialogTitle>
        <DialogDescription className="text-center">
          Preencha os campos abaixo
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <div className="grid gap-4 pb-4">
            <FormField
              control={form.control}
              name="PRODUCT_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do produto</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="PRODUCT_CATEGORY"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria do produto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {categorias
                        .filter((categoria: any) => !categoria.CATEGORY_DELETED)
                        .map((categoria: any) => (
                          <SelectItem key={categoria._id} value={categoria._id}>{categoria.CATEGORY_NAME}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
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
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
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
                  <FormMessage className="text-[10px]" />
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
  );
}