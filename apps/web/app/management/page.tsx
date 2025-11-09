import { Card, Button } from '@sistemaescola/ui';

const managementSections = [
  {
    id: 'classes',
    title: 'Turmas e matrículas',
    description: 'Configure anos letivos, calendários, turmas e matrículas de alunos.'
  },
  {
    id: 'users',
    title: 'Usuários e permissões',
    description: 'Controle perfis de acesso, convites e auditoria de ações.'
  },
  {
    id: 'documents',
    title: 'Documentos oficiais',
    description: 'Publique e versiona documentos para turmas e usuários.'
  }
];

export default function ManagementPage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Gestão escolar</h1>
        <p className="text-sm text-slate-500">
          Ferramentas administrativas para secretarias e direção da {{NOME_DA_ESCOLA}}.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {managementSections.map((section) => (
          <Card key={section.id} title={section.title} description={section.description}>
            <Button variant="secondary">Configurar</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
