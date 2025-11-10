import { Card } from '@sistemaescola/ui';
import { Suspense } from 'react';

async function fetchDashboardData() {
  return {
    loans: { overdue: 2, dueToday: 1, active: 5 },
    attendance: { pending: 3, lastUpdated: new Date().toISOString() },
    leaves: { pendingApproval: 1 },
    notices: [{ id: '1', title: 'Reunião pedagógica', publishedAt: '2024-02-15' }]
  };
}

export default async function DashboardPage() {
  const data = await fetchDashboardData();
  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Visão geral dos principais indicadores da {{NOME_DA_ESCOLA}}.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Empréstimos ativos" description={`${data.loans.active} no total`} />
        <Card title="Vencem hoje" description={`${data.loans.dueToday} empréstimo(s)`} />
        <Card title="Em atraso" description={`${data.loans.overdue} empréstimo(s)`} />
        <Card title="Chamadas pendentes" description={`${data.attendance.pending} aulas`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card
          title="Últimas licenças"
          description={`Licenças aguardando aprovação: ${data.leaves.pendingApproval}`}
        >
          <p className="text-sm text-slate-600">Fluxo completo de aprovação disponível na aba Licenças.</p>
        </Card>
        <Card title="Avisos recentes">
          <ul className="space-y-2 text-sm text-slate-600">
            {data.notices.map((notice) => (
              <li key={notice.id} className="flex items-center justify-between">
                <span>{notice.title}</span>
                <span className="text-xs text-slate-400">{notice.publishedAt}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';

export function DashboardSkeleton() {
  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-32 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export function DashboardPageWithSuspense() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {/* @ts-expect-error Async Server Component */}
      <DashboardPage />
    </Suspense>
  );
}
