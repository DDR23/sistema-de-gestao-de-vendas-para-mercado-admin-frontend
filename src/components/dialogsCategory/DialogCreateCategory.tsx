import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import useCreate from "@/hooks/useCreate";
import { useEffect, useState } from "react";
import { toast } from "../ui/use-toast";
import Loading from "../ui/loading";
import { CircleCheck } from "lucide-react";
import { schemaCategoryPost } from "@/schemas/schemaCategoryPost";

interface CategoryCreateValues {
  CATEGORY_NAME: string;
}

export default function DialogCreateCategory() {
  const form = useForm<CategoryCreateValues>({
    mode: 'onBlur',
    resolver: zodResolver(schemaCategoryPost),
    defaultValues: {
      CATEGORY_NAME: '',
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
  }, []);

  const [data, setData] = useState<CategoryCreateValues>({} as CategoryCreateValues);
  const [posted, setPosted] = useState(false);
  const { isPosted, isPosting, error, error409 } = useCreate(`${process.env.NEXT_PUBLIC_BASE_URL}/category/create`, data, posted, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  const submitForm: SubmitHandler<CategoryCreateValues> = (formData) => {
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
        title: "Categoria cadastrada",
        description: "A categoria foi criada com sucesso."
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
        <DialogTitle className="text-center">Nova Categoria</DialogTitle>
        <DialogDescription className="text-center">
          Preencha os campos abaixo
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitForm)} className="space-y-2">
          <div className="grid gap-4 pb-4">
            <FormField
              control={form.control}
              name="CATEGORY_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da categoria</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
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