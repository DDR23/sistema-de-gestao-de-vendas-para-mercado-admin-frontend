'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/ui/loading';
import PageProdutos from '@/components/pages/produto/PageProdutos';

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

export default function ProdutosPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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
      const fetchProductsAndCategories = async () => {
        try {
          const [productsResponse, categoriesResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product`, {
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

          const productsData: Product[] = await productsResponse.json();
          const categoriesData: Category[] = await categoriesResponse.json();

          const categoryMap: { [key: string]: string } = categoriesData.reduce<{ [key: string]: string }>((acc, category) => {
            acc[category._id] = category.CATEGORY_NAME;
            return acc;
          }, {});

          const productsWithCategoryNames = productsData.map(product => ({
            ...product,
            PRODUCT_CATEGORY: categoryMap[product.PRODUCT_CATEGORY] || product.PRODUCT_CATEGORY
          }));

          setProducts(productsWithCategoryNames);
          setCategories(categoriesData);
        } catch (error) {
          console.error('Failed to fetch products and categories:', error);
        }
      };

      fetchProductsAndCategories();
    }
  }, [authToken]);

  if (isLoading) {
    return <Loading />;
  }

  return <PageProdutos produtos={products} categorias={categories} />;
}