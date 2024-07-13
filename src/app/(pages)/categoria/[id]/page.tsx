'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import useGet from '@/hooks/useGet';
import PageCategoriaId from '@/components/pages/categorias/categoriaId/PageCategoriaId';

export default function CategoriaIdPage({ params }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
  }, [isLoading]);

  const { data } = useGet(`${process.env.NEXT_PUBLIC_BASE_URL}/category/${params.id}`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  }, [authToken]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <Loading />;
  }

  return data ? <PageCategoriaId categoria={data}/> : <Loading />;
}