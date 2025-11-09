'use client';

import { useState } from 'react';
import { Button, Card } from '@sistemaescola/ui';

const initialNotices = [
  { id: '1', title: 'Reunião de pais', audience: 'RESPONSAVEIS', publishedAt: '2024-03-12' },
  { id: '2', title: 'Biblioteca - prazos', audience: 'ALUNOS', publishedAt: '2024-03-10' }
];

export default function NoticesPage() {
  const [notices] = useState(initialNotices);

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Avisos</h1>
          <p className="text-sm text-slate-500">Envie comunicados segmentados por perfil, turma ou série.</p>
        </div>
        <Button>Criar aviso</Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {notices.map((notice) => (
          <Card key={notice.id} title={notice.title} description={`Público: ${notice.audience}`}>
            <p className="text-xs text-slate-400">Publicado em {notice.publishedAt}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
