'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PageClienteId from '@/components/pages/clientes/clienteId/PageClienteId';

interface User {
  USER_ADMIN: boolean;
  USER_EMAIL: string;
  USER_NAME: string;
  USER_DELETED: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface Compra {
  _id: string;
  CART_USER_ID: string;
  CART_PRODUCT: {
    PRODUCT_ID: string;
    PRODUCT_NAME?: string;
    PRODUCT_QUANTITY: number;
    _id: string;
  }[];
  CART_PRICE: number;
  CART_STATUS: 'active' | 'completed' | 'canceled';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CompraStats {
  activeCount: number;
  completedCount: number;
  canceledCount: number;
  totalCompletedValue: number;
  totalActiveValue: number;
  totalTransactions: number;
}

interface UserDetailsPageProps {
  params: {
    id: string;
  };
}

export default function ClienteIdPage({ params }: UserDetailsPageProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState<boolean>(true);
  const [compraStats, setCompraStats] = useState<CompraStats>({
    activeCount: 0,
    completedCount: 0,
    canceledCount: 0,
    totalCompletedValue: 0,
    totalActiveValue: 0,
    totalTransactions: 0,
  });

  const userId = params.id;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const tokenAdmin = localStorage.getItem('tokenAdmin');
        if (!tokenAdmin) throw new Error('Admin Token not found');

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${tokenAdmin}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData: User = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Fetch user error:', error);
        router.push('/');
      }
    };

    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, userId, router]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!userId || !token ) throw new Error('User ID or tokens not found');

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          setCompras([]);
          setFetchLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch compras');
        }

        const data: Compra[] = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setCompras(sortedData);
        setFetchLoading(false);

        const stats = data.reduce((acc, compra) => {
          acc.totalTransactions++;
          switch (compra.CART_STATUS) {
            case 'active':
              acc.activeCount++;
              acc.totalActiveValue += compra.CART_PRICE;
              break;
            case 'completed':
              acc.completedCount++;
              acc.totalCompletedValue += compra.CART_PRICE;
              break;
            case 'canceled':
              acc.canceledCount++;
              break;
          }
          return acc;
        }, {
          activeCount: 0,
          completedCount: 0,
          canceledCount: 0,
          totalCompletedValue: 0,
          totalActiveValue: 0,
          totalTransactions: 0,
        });

        setCompraStats(stats);
      } catch (error: any) {
        console.error('Fetch compras error:', error);
        setFetchError(error.message);
        setFetchLoading(false);
      }
    };

    if (isAuthenticated && userId) {
      fetchCompras();
    }
  }, [isAuthenticated, userId]);

  if (isLoading || fetchLoading) {
    return <Loading />;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  return user ? <PageClienteId user={user} compras={compras} stats={compraStats} /> : <Loading />;
}