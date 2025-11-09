'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Card } from '@sistemaescola/ui';

const leaveSchema = z.object({
  reason: z.enum(['SAUDE', 'CAPACITACAO', 'PESSOAL']),
  startDate: z.string(),
  endDate: z.string(),
  comments: z.string().optional()
});

type LeaveForm = z.infer<typeof leaveSchema>;

export default function LeavesPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<LeaveForm>({ resolver: zodResolver(leaveSchema) });
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: LeaveForm) => {
    console.log('Licença enviada', data);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Licenças/Ausências</h1>
        <p className="text-sm text-slate-500">
          Solicite licenças com fluxo de aprovação e anexos obrigatórios quando necessário.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card title="Nova solicitação">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Motivo</label>
              <select
                className="mt-1 w-full rounded-md border border-slate-200 p-2"
                {...register('reason')}
              >
                <option value="SAUDE">Saúde</option>
                <option value="CAPACITACAO">Capacitação</option>
                <option value="PESSOAL">Pessoal</option>
              </select>
              {errors.reason && <span className="text-xs text-red-500">{errors.reason.message}</span>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-700">Início</label>
                <input type="date" className="mt-1 w-full rounded-md border p-2" {...register('startDate')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Fim</label>
                <input type="date" className="mt-1 w-full rounded-md border p-2" {...register('endDate')} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Comentários</label>
              <textarea className="mt-1 w-full rounded-md border p-2" rows={3} {...register('comments')} />
            </div>
            {watch('reason') === 'SAUDE' && (
              <div className="rounded-md border border-dashed border-red-300 bg-red-50 p-3 text-sm text-red-600">
                Anexe atestado médico após salvar o rascunho.
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" type="button">
                Salvar rascunho
              </Button>
              <Button type="submit">Enviar para aprovação</Button>
            </div>
          </form>
        </Card>
        <Card title="Trilha de auditoria">
          <ol className="space-y-2 text-sm text-slate-600">
            <li>Rascunho criado</li>
            <li>Enviado à gestão</li>
            <li>Aprovação pendente</li>
          </ol>
          {submitted && <p className="mt-4 text-sm text-green-600">Solicitação registrada com sucesso!</p>}
        </Card>
      </div>
    </div>
  );
}
