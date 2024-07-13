import DialogEditProductCategory from "@/components/dialogsProduct/DialogEditProductCategory"
import DialogEditProductName from "@/components/dialogsProduct/DialogEditProductName"
import DialogEditProductPrice from "@/components/dialogsProduct/DialogEditProductPrice"
import DialogEditProductQuantity from "@/components/dialogsProduct/DialogEditProductQuantity"
import DialogEditProductStatus from "@/components/dialogsProduct/DialogEditProductStatus"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import formatPrice from "@/utils/formatPrice"
import { ChevronLeft, Pen } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function PageProdutoId({ produto, categorias }: any) {
  const router = useRouter();
  const productId = produto?._id
  const [authToken, setAuthToken] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
  }, [])

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center gap-2">
        <ChevronLeft className="cursor-pointer" onClick={() => router.back()} />
        <h1 className="text-lg font-semibold md:text-2xl">Editar produto</h1>
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
                  <DialogEditProductName productId={productId} authToken={authToken} />
                </Dialog>
              </div>
              <div className="font-medium">{produto.PRODUCT_NAME}</div>
            </div>
            <div className="mb-5 pb-2 border-b">
              <div className="w-full justify-between text-sm flex items-center gap-2 text-muted-foreground md:inline-flex">
                Categoria
                <Dialog>
                  <DialogTrigger asChild>
                    <Pen style={{
                      cursor: 'pointer'
                    }} size={20} />
                  </DialogTrigger>
                  <DialogEditProductCategory productId={productId} authToken={authToken} category={categorias} />
                </Dialog>
              </div>
              <div className="font-medium">{produto.PRODUCT_CATEGORY}</div>
            </div>
            <div className="mb-5 pb-2 border-b">
              <div className="w-full justify-between text-sm flex items-center gap-2 text-muted-foreground md:inline-flex">
                Preço
                <Dialog>
                  <DialogTrigger asChild>
                    <Pen style={{
                      cursor: 'pointer'
                    }} size={20} />
                  </DialogTrigger>
                  <DialogEditProductPrice productId={productId} authToken={authToken} />
                </Dialog>
              </div>
              <div className="font-medium">{formatPrice(produto.PRODUCT_PRICE)}</div>
            </div>
            <div className="mb-5 pb-2 border-b">
              <div className="w-full justify-between text-sm flex items-center gap-2 text-muted-foreground md:inline-flex">
                Estoque
                <Dialog>
                  <DialogTrigger asChild>
                    <Pen style={{
                      cursor: 'pointer'
                    }} size={20} />
                  </DialogTrigger>
                  <DialogEditProductQuantity productId={productId} authToken={authToken} />
                </Dialog>
              </div>
              <div className="font-medium">{produto.PRODUCT_QUANTITY}</div>
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
                  <DialogEditProductStatus productId={productId} authToken={authToken} status={produto.PRODUCT_DELETED} />
                </Dialog>
              </div>
              <div className="font-medium">{produto.PRODUCT_DELETED ? 'Indisponível' : 'Disponível'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}