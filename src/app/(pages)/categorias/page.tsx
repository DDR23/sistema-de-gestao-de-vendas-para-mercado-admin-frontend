'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PageCategorias from '@/components/pages/categorias/PageCategorias';
import useGet from '@/hooks/useGet';

export default function CategoriasPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token)
  }, [isLoading])

  const { data } = useGet(`${process.env.NEXT_PUBLIC_BASE_URL}/category`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }, [authToken]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [router]);

  if (isLoading) {
    return <Loading />;
  }

  return <PageCategorias categories={data} />;
}