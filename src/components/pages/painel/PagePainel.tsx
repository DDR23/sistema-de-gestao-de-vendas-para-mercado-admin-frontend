import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import formatDate from "@/utils/formatDate";
import formatPrice from "@/utils/formatPrice";
import { Activity, DollarSign, ListFilter, MoreHorizontal, PieChart, Users } from "lucide-react";
import { useState } from "react";

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

interface UserStats {
  activeUsers: number;
  deactivatedUsers: number;
  totalUsers: number;
}

interface TransactionStats {
  totalTransactions: number;
  todayTransactions: number;
}

interface PagePainelProps {
  compras: Compra[] | null;
  stats: CompraStats & UserStats & TransactionStats;
}

const statusMap: { [key: string]: { label: string, color: string } } = {
  active: { label: 'Pendente', color: 'bg-orange-400' },
  completed: { label: 'Concluída', color: 'bg-green-500' },
  canceled: { label: 'Cancelada', color: 'bg-red-500' }
};

function getStatusLabelAndClass(status: string) {
  return statusMap[status] || { label: 'Desconhecido', color: 'bg-gray-500' };
}

export default function PagePainel({ compras, stats }: PagePainelProps) {
  const [filter, setFilter] = useState<string>('Todos');

  const handleFilterChange = (status: string) => {
    setFilter(status);
  };

  const filteredCompra = compras?.filter((compra: Compra) => {
    if (filter === 'Todos') return true;
    if (filter === 'Pendente') return compra.CART_STATUS === 'active';
    if (filter === 'Concluído') return compra.CART_STATUS === 'completed';
    if (filter === 'Cancelado') return compra.CART_STATUS === 'canceled';
  });

  const rows = filteredCompra?.map((compra: Compra) => (
    <TableRow key={compra._id}>
      <TableCell className="font-medium">
        <div className="text-sm text-muted-foreground">Ordem #{compra._id}</div>
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
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Painel</h1>
        </div>
        <div className="flex flex-1 rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1">
          <div className="grid w-full auto-rows-max items-start gap-6 md:gap-6 lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              <Card x-chunk="dashboard-01-chunk-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de vendas
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatPrice(stats.totalCompletedValue)}</div>
                  <div className="text-sm text-muted-foreground">+ {formatPrice(stats.totalActiveValue)} em vendas pendetes</div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Resumo de vendas
                  </CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{stats.completedCount} concluídas</div>
                  <div className="text-sm text-muted-foreground">{stats.activeCount} pendentes</div>
                  <div className="text-sm text-muted-foreground">{stats.canceledCount} canceladas</div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-2">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transações</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{stats.totalTransactions} transações ao total</div>
                  <div className="text-sm text-muted-foreground">{stats.todayTransactions} hoje</div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-01-chunk-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">{stats.totalUsers} total</div>
                  <div className="text-sm text-muted-foreground">{stats.activeUsers} ativos</div>
                  <div className="text-sm text-muted-foreground">{stats.deactivatedUsers} desativados</div>
                </CardContent>
              </Card>
            </div>
            <div className="mb-10">
              <Tabs className="w-full" defaultValue="all">
                <div className="flex items-center">
                  <h1 className="text-lg font-semibold md:text-2xl">Ultimas Transações</h1>
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
                      <ScrollArea className="h-[45vh] w-full">
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
                                <TableHead className='flex flex-col justify-center items-center'>Compras</TableHead>
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
          </div>
        </div>
      </main>
    </>
  )
}