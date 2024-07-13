'use client';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import formatDate from '@/utils/formatDate';
import formatPrice from '@/utils/formatPrice';
import { ListFilter, MoreHorizontal, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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

interface PageTransacoesProps {
  compras: Compra[] | null;
}

const statusMap: { [key: string]: { label: string, color: string } } = {
  active: { label: 'Pendente', color: 'bg-orange-400' },
  completed: { label: 'Concluída', color: 'bg-green-500' },
  canceled: { label: 'Cancelada', color: 'bg-red-500' }
};

function getStatusLabelAndClass(status: string) {
  return statusMap[status] || { label: 'Desconhecido', color: 'bg-gray-500' };
}

export default function PageTransacoes({ compras }: PageTransacoesProps) {
  const [filter, setFilter] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (status: string) => {
    setFilter(status);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const filteredCompra = compras?.filter((compra: Compra) => {
    const matchesFilter =
      filter === 'Todos' ||
      (filter === 'Pendente' && compra.CART_STATUS === 'active') ||
      (filter === 'Concluído' && compra.CART_STATUS === 'completed') ||
      (filter === 'Cancelado' && compra.CART_STATUS === 'canceled');

    const matchesSearchTerm = compra._id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearchTerm;
  });

  const rows = filteredCompra?.map((compra: Compra) => (
    <TableRow key={compra._id}>
      <TableCell className="font-medium flex flex-col">
        <div className="text-sm text-muted-foreground mb-1">Ordem #{compra._id}</div>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusLabelAndClass(compra.CART_STATUS).color} md:hidden`} />
          <span className="text-sm">{formatPrice(compra.CART_PRICE)}</span>
        </div>
      </TableCell>
      <TableCell className="text-end hidden md:table-cell">{formatDate(compra.createdAt)}</TableCell>
      <TableCell className="text-end hidden md:table-cell">
        <div className="flex items-center justify-end">
          <span className="text-sm mr-2">{getStatusLabelAndClass(compra.CART_STATUS).label}</span>
          <div className={`w-2 h-2 rounded-full ml-1 ${getStatusLabelAndClass(compra.CART_STATUS).color}`} />
        </div>
      </TableCell>
      <TableCell className="text-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-haspopup="true"
              size="icon"
              variant="ghost"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <a href={`/transacao/${compra._id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Detalhes
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  ));

  return (
    <>
      <main className="flex flex-col gap-4 p-4 lg:gap-2 lg:p-6 lg:pb-0">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Transações</h1>
        </div>
        <div className="flex flex-1 justify-center rounded-lg border-0 shadow-sm" x-chunk="dashboard-02-chunk-1">
          <Tabs className="w-full" defaultValue="all">
            <div className="flex items-center">
              <div className="relative mr-5 flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
                />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filtro
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      className="cursor-pointer"
                      checked={filter === 'Todos'}
                      onCheckedChange={() => handleFilterChange('Todos')}
                    >
                      Todos
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      className="cursor-pointer"
                      checked={filter === 'Pendente'}
                      onCheckedChange={() => handleFilterChange('Pendente')}
                    >
                      Pendente
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      className="cursor-pointer"
                      checked={filter === 'Concluído'}
                      onCheckedChange={() => handleFilterChange('Concluído')}
                    >
                      Concluído
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      className="cursor-pointer"
                      checked={filter === 'Cancelado'}
                      onCheckedChange={() => handleFilterChange('Cancelado')}
                    >
                      Cancelado
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0" className="border-0">
                <CardContent className="flex flex-1 flex-col p-0">
                  <ScrollArea className="h-[65vh] w-full">
                    {compras && compras.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className='w-3/5 md:w-[40%]'>Compra</TableHead>
                            <TableHead className="w-1/5 md:w-[20%] text-end hidden md:table-cell">Data</TableHead>
                            <TableHead className="w-1/5 md:w-[20%] text-end hidden md:table-cell">Status</TableHead>
                            <TableHead className='w-1/5 md:w-[20%]'>
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rows}
                        </TableBody>
                      </Table>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted hover:bg-muted">
                            <TableHead className='flex flex-col justify-center items-center'>Transações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div className="h-[30vh] flex flex-col justify-center items-center">
                                <h1 className="text-lg font-semibold md:text-2xl">Vázio</h1>
                                <p className="text-sm text-muted-foreground md:inline">Nada por aqui..</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}