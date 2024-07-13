export default function formatDate(value: any) {
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR');
}