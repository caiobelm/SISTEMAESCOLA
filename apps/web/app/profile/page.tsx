import { Card, Button } from '@sistemaescola/ui';

const profile = {
  name: 'Administrador',
  email: 'admin@escola.local',
  phone: '+55 11 99999-1111',
  role: 'ADMIN'
};

const documents = [
  { id: 'doc1', title: 'RG digitalizado.pdf', uploadedAt: '2024-01-10' },
  { id: 'doc2', title: 'Comprovante residência.pdf', uploadedAt: '2024-02-05' }
];

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Perfil</h1>
        <p className="text-sm text-slate-500">
          Atualize dados pessoais, preferências e configure autenticação em duas etapas.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card title={profile.name} description={profile.role}>
          <dl className="space-y-2 text-sm text-slate-600">
            <div>
              <dt className="font-medium text-slate-700">E-mail</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">Telefone</dt>
              <dd>{profile.phone}</dd>
            </div>
          </dl>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary">Editar perfil</Button>
            <Button variant="ghost">Configurar 2FA</Button>
          </div>
        </Card>
        <Card title="Documentos enviados">
          <ul className="space-y-2 text-sm text-slate-600">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between">
                <span>{doc.title}</span>
                <span className="text-xs text-slate-400">{doc.uploadedAt}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
