import { Card, Button } from '@sistemaescola/ui';

const documents = [
  { id: '1', title: 'Calendário {{ANO_LETIVO}}', scope: 'ESCOLA', version: 2 },
  { id: '2', title: 'Plano pedagógico', scope: 'TURMA', version: 1 }
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Documentos</h1>
          <p className="text-sm text-slate-500">Centralize arquivos com controle de versão e escopo.</p>
        </div>
        <Button>Enviar documento</Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {documents.map((doc) => (
          <Card key={doc.id} title={doc.title} description={`Escopo: ${doc.scope}`}>
            <p className="text-sm text-slate-500">Versão {doc.version}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost">Baixar</Button>
              <Button variant="secondary">Nova versão</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
