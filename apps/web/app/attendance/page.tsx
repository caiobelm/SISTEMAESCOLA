'use client';

import { useState } from 'react';
import { Button, Card } from '@sistemaescola/ui';

const students = [
  { id: '1', name: 'Lucas' },
  { id: '2', name: 'Marina' },
  { id: '3', name: 'Pedro' }
];

const statuses = [
  { code: 'P', label: 'Presente' },
  { code: 'F', label: 'Falta' },
  { code: 'A', label: 'Atraso' },
  { code: 'J', label: 'Justificado' }
];

export default function AttendancePage() {
  const [record, setRecord] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Chamada</h1>
          <p className="text-sm text-slate-500">
            Registre presença, atrasos e faltas rapidamente. Regras automáticas aplicadas a atrasos &gt; 15 minutos.
          </p>
        </div>
        <Button onClick={() => console.log('Sync offline chamada')}>Sincronizar</Button>
      </header>
      <Card title="Turma 1º Ano A" description="Disciplina: Matemática">
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
              <span className="font-medium text-slate-700">{student.name}</span>
              <div className="flex gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status.code}
                    variant={record[student.id] === status.code ? 'primary' : 'ghost'}
                    onClick={() => setRecord((prev) => ({ ...prev, [student.id]: status.code }))}
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <Button variant="ghost">Salvar rascunho</Button>
            <Button>Enviar chamada</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
