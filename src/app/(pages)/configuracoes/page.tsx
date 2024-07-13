'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PageConfiguracoes from '@/components/pages/configuracoes/PageConfiguracoes';
import useGet from '@/hooks/useGet';

export default function ConfiguracoesPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token)
  }, [isLoading])

  const { data } = useGet(`${process.env.NEXT_PUBLIC_BASE_URL}/user/me`, {
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

  return <PageConfiguracoes user={data}/>;
}