'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PagePainel from '@/components/pages/painel/PagePainel';

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
}

interface CompraStats {
  activeCount: number;
  completedCount: number;
  canceledCount: number;
  totalCompletedValue: number;
  totalActiveValue: number;
}

interface User {
  _id: string;
  USER_ADMIN: boolean;
  USER_DELETED: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserStats {
  activeUsers: number;
  deactivatedUsers: number;
  totalUsers: number;
}

interface TransactionStats {
  totalTransactions: number;
  todayTransactions: number;
}

export default function PainelPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [compras, setCompras] = useState<Compra[] | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [compraStats, setCompraStats] = useState<CompraStats & TransactionStats & UserStats>({
    activeCount: 0,
    completedCount: 0,
    canceledCount: 0,
    totalCompletedValue: 0,
    totalActiveValue: 0,
    totalTransactions: 0,
    todayTransactions: 0,
    activeUsers: 0,
    deactivatedUsers: 0,
    totalUsers: 0
  });
  

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`
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
        const latestCompras = sortedData.slice(0, 10);
        setCompras(latestCompras);

        const today = new Date().toISOString().split('T')[0];

        const stats = data.reduce((acc, compra) => {
          if (compra.createdAt.startsWith(today)) {
            acc.todayTransactions++;
          }
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
          todayTransactions: 0
        });

        setCompraStats(prevStats => ({ ...prevStats, ...stats }));
      } catch (error) {
        setFetchError((error as Error).message);
      } finally {
        setFetchLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('tokenAdmin')}`
          }
        });

        if (response.status === 404) {
          setFetchLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data: User[] = await response.json();
        const filteredData = data.filter(user => user.USER_ADMIN === false);

        const userStats = filteredData.reduce((acc, user) => {
          switch (user.USER_DELETED) {
            case false:
              acc.activeUsers++;
              break;
            case true:
              acc.deactivatedUsers++;
              break;
          }
          acc.totalUsers++;
          return acc;
        }, {
          activeUsers: 0,
          deactivatedUsers: 0,
          totalUsers: 0
        });

        setCompraStats(prevStats => ({ ...prevStats, ...userStats }));
      } catch (error) {
        setFetchError((error as Error).message);
      }
    };

    if (isAuthenticated) {
      fetchCompras();
      fetchUsers();
    }
  }, [isAuthenticated, router]);

  if (isLoading || fetchLoading) {
    return <Loading />;
  }

  if (fetchError) {
    return <div>Error: {fetchError}</div>;
  }

  return <PagePainel compras={compras} stats={compraStats} />
}