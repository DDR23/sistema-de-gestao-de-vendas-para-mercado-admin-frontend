import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import formatDate from "@/utils/formatDate";
import { ListFilter, MoreHorizontal, Search } from "lucide-react";
import { Input } from '@/components/ui/input';

interface User {
  USER_ADMIN: boolean;
  USER_EMAIL: string;
  USER_NAME: string;
  USER_DELETED: boolean;
  createdAt: string;
  updatedAt: string;
  _id: string;
}

interface PageClientesProps {
  users: User[];
}

export default function PageClientes({ users }: PageClientesProps) {
  const [filter, setFilter] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleFilterChange = (status: string) => {
    setFilter(status);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUser = users?.filter((user: User) => {
    const matchesFilter =
      filter === 'Todos' ||
      (filter === 'Ativo' && !user.USER_DELETED) ||
      (filter === 'Desativado' && user.USER_DELETED);

    const matchesSearchTerm = user.USER_NAME.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearchTerm;
  });

  const rows = filteredUser?.map((user: User) => (
    <TableRow key={user._id}>
      <TableCell className="font-medium flex flex-col">
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full ${user.USER_DELETED ? 'bg-red-500' : 'bg-green-500'} mr-2 md:hidden`} />
          <span className="text-sm">{user.USER_NAME}</span>
          <span className="text-[10px] ml-3 text-muted-foreground">{user?.USER_ADMIN && 'Admin'}</span>
        </div>
        <div className="text-sm text-muted-foreground mb-1 ">{user.USER_EMAIL}</div>
      </TableCell>
      <TableCell className="text-end hidden md:table-cell">{formatDate(user.createdAt)}</TableCell>
      <TableCell className="text-end hidden md:table-cell">
        <div className="flex items-center justify-end">
          <span className="text-sm mr-1">{user.USER_DELETED ? 'Desativado' : 'Ativo'}</span>
          <div className={`w-2 h-2 rounded-full ml-1 ${user.USER_DELETED ? 'bg-red-500' : 'bg-green-500'}`} />
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
            <a href={`/cliente/${user._id}`}>
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
      <main className="flex flex-col gap-4 p-4 lg:gap-2 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Clientes</h1>
        </div>
        <div className="flex flex-1 justify-center rounded-lg border-0 shadow-sm">
          <Tabs className="w-full" defaultValue="clientes">
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
                    <Button variant="outline" size="sm" className="gap-1 text-sm">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filtro</span>
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
                      checked={filter === 'Ativo'}
                      onCheckedChange={() => handleFilterChange('Ativo')}
                    >
                      Ativo
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      className="cursor-pointer"
                      checked={filter === 'Desativado'}
                      onCheckedChange={() => handleFilterChange('Desativado')}
                    >
                      Desativado
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <TabsContent value="clientes">
              <ScrollArea className="h-[65vh]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                      <TableHead className='md:w-[40%]'>Cliente</TableHead>
                      <TableHead className="md:w-[20%] text-end hidden md:table-cell">Data de criação</TableHead>
                      <TableHead className="md:w-[20%] text-end hidden md:table-cell">Status</TableHead>
                      <TableHead className='md:w-[20%]'>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}