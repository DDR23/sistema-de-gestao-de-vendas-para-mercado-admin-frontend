'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PageTransacaoId from '@/components/pages/transacoes/transacaoId/PageTransacaoId';

interface Product {
  _id: string;
  PRODUCT_CATEGORY: string;
  PRODUCT_DELETED: boolean;
  PRODUCT_NAME: string;
  PRODUCT_PRICE: number;
  PRODUCT_QUANTITY: number;
}

interface Compra {
  _id: string;
  CART_USER_ID: string;
  CART_PRODUCT: {
    PRODUCT_ID: string;
    PRODUCT_QUANTITY: number;
    _id: string;
  }[];
  CART_PRICE: number;
  CART_STATUS: 'active' | 'completed' | 'canceled';
  createdAt: string;
  updatedAt: string;
  __v: number;
  USER_NAME?: string | null;
}

interface CompraIdPageProps {
  params: {
    id: string
  }
}

export default function TransacaoIdPage({ params }: CompraIdPageProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authTokenAdmin, setAuthTokenAdmin] = useState<string | null>(null);
  const [compra, setCompra] = useState<Compra | null>(null);
  const [produtos, setProdutos] = useState<Product[]>([]);

  const compraId = params.id;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenAdmin = localStorage.getItem('tokenAdmin');
    setAuthToken(token);
    setAuthTokenAdmin(tokenAdmin);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authToken && compraId) {
      const fetchCompraDetails = async () => {
        try {
          const [compraResponse, productsResponse, userResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/${compraId}`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            }),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            }),
            compra?.CART_USER_ID ?
              fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${compra.CART_USER_ID}`, {
                headers: {
                  Authorization: `Bearer ${authTokenAdmin}`
                }
              }) :
              Promise.resolve(null)
          ]);

          const compraData: Compra = await compraResponse.json();
          const productsData: Product[] = await productsResponse.json();

          let userName: string | null = null;

          if (userResponse) {
            const userData: { USER_NAME: string } = await userResponse.json();
            userName = userData.USER_NAME;
          }

          const compraProdutosDetalhes = compraData.CART_PRODUCT.map(item => {
            const produtoDetalhes = productsData.find(prod => prod._id === item.PRODUCT_ID);
            return {
              ...item,
              ...produtoDetalhes,
              PRODUCT_QUANTITY: item.PRODUCT_QUANTITY,
              PRODUCT_ID: item.PRODUCT_ID
            } as Product;
          });

          setCompra({
            ...compraData,
            USER_NAME: userName
          });
          setProdutos(compraProdutosDetalhes);
        } catch (error) {
          console.error('Failed to fetch compra details:', error);
        }
      };

      fetchCompraDetails();
    }
  }, [authToken, compraId, compra?.CART_USER_ID]);

  if (isLoading) {
    return <Loading />;
  }

  // if (!compra) {
  //   return <p>Compra não encontrada.</p>;
  // }

  return compra ? <PageTransacaoId compra={compra} produtos={produtos} /> : <Loading />;
}