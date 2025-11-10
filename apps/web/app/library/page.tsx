import { Card, Button } from '@sistemaescola/ui';

const works = [
  {
    id: '1',
    title: 'Matemática Aplicada',
    author: 'Autor Desconhecido',
    status: 'Disponível'
  },
  {
    id: '2',
    title: 'História do Brasil',
    author: 'Ana Souza',
    status: 'Emprestado'
  }
];

export default function LibraryPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Biblioteca</h1>
          <p className="text-sm text-slate-500">
            Gerencie catálogo, empréstimos e renovações da {{NOME_DA_ESCOLA}}.
          </p>
        </div>
        <Button>Adicionar obra</Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {works.map((work) => (
          <Card key={work.id} title={work.title} description={`Autor: ${work.author}`}>
            <p className="text-sm text-slate-600">Status: {work.status}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary">Ver detalhes</Button>
              <Button variant="ghost">Emprestar</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
