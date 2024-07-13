import { Copy } from "lucide-react";
import { Button } from "../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import formatPrice from "@/utils/formatPrice";
import Image from "next/image";
import { toast } from "../ui/use-toast";

export default function DialogQrcode({ price }: any) {
  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_QRCODE_LINK || '');
    toast({
      title: "QRCode cpiado",
    });
  };

  return (
    <DialogHeader>
      <div className="flex justify-center">
        <Image src='/qrcode.png' width={200} height={200} alt="QR Code" />
      </div>
      <DialogDescription className="text-center text-sm">Efetue o pagamento</DialogDescription>
      <DialogTitle className="text-center">Valor total {formatPrice(price)}</DialogTitle>
      <DialogDescription className="text-center text-sm">
        <Button className="my-2 gap-2" onClick={handleCopyPixKey}>
          <Copy size={20} />
          <span>copiar chave PIX</span>
        </Button>
      </DialogDescription>
    </DialogHeader>
  );
}