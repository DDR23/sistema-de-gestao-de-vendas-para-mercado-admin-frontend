import DialogEditCategoryName from "@/components/dialogsCategory/DialogEditCategoryName"
import DialogEditCategoryStatus from "@/components/dialogsCategory/DialogEditCategoryStatus"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, Pen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageCategoriaId({ categoria }: any) {
  const router = useRouter();
  const categorytId = categoria?._id
  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-2">
        <ChevronLeft className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-lg font-semibold md:text-2xl">Editar Categoria</h1>
      </div>
      <div
        className="flex flex-1 justify-center rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1"
      >
        <Card className="w-full pt-5 border-0">
          <CardContent>
            <div className="mb-5 pb-2 border-b">
              <div className="w-full justify-between text-sm flex items-center gap-2 text-muted-foreground md:inline-flex">
                Nome
                <Dialog>
                  <DialogTrigger asChild>
                    <Pen style={{
                      cursor: 'pointer'
                    }} size={20} />
                  </DialogTrigger>
                  <DialogEditCategoryName categoryId={categorytId} authToken={authToken} />
                </Dialog>
              </div>
              <div className="font-medium">{categoria.CATEGORY_NAME}</div>
            </div>
            <div className="mb-5 pb-2 border-b">
              <div className="w-full justify-between text-sm flex items-center gap-2 text-muted-foreground md:inline-flex">
                Status
                <Dialog>
                  <DialogTrigger asChild>
                    <Pen style={{
                      cursor: 'pointer'
                    }} size={20} />
                  </DialogTrigger>
                  <DialogEditCategoryStatus categoryId={categorytId} authToken={authToken} status={categoria.CATEGORY_DELETED}/>
                </Dialog>
              </div>
              <div className="font-medium">{categoria.CATEGORY_DELETED ? 'Indisponível' : 'Disponível'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}