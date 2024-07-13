'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PageProdutoId from '@/components/pages/produto/produtoId/PageProdutoId';

interface Product {
  _id: string;
  PRODUCT_CATEGORY: string;
  PRODUCT_DELETED: boolean;
  PRODUCT_NAME: string;
  PRODUCT_PRICE: number;
  PRODUCT_QUANTITY: number;
}

interface Category {
  _id: string;
  CATEGORY_NAME: string;
}

export default function ProdutoIdPage({ params }: any) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (authToken) {
      const fetchProductAndCategories = async () => {
        try {
          const [productResponse, categoriesResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${params.id}`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            }),
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/category`, {
              headers: {
                Authorization: `Bearer ${authToken}`
              }
            })
          ]);

          const productData: Product = await productResponse.json();
          const categoriesData: Category[] = await categoriesResponse.json();

          const category = categoriesData.find(cat => cat._id === productData.PRODUCT_CATEGORY);
          if (category) {
            productData.PRODUCT_CATEGORY = category.CATEGORY_NAME;
          }

          setProduct(productData);
          setCategories(categoriesData);
        } catch (error) {
          console.error('Failed to fetch product and categories:', error);
        }
      };

      fetchProductAndCategories();
    }
  }, [authToken]);

  if (isLoading) {
    return <Loading />;
  }

  return product ? <PageProdutoId produto={product} categorias={categories} /> : <Loading />;
}