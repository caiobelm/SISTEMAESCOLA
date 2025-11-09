import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-100 p-6 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">{{NOME_DA_ESCOLA}} - Portal Unificado</h1>
      <p className="max-w-2xl text-slate-600">
        Acompanhe biblioteca, licenças, chamadas e gestão acadêmica em um só lugar. Utilize o menu
        para acessar cada módulo conforme sua permissão de acesso.
      </p>
      <div className="flex gap-3">
        <Link
          href="/auth/login"
          className="rounded-md bg-primary px-4 py-2 text-white shadow transition hover:opacity-90"
        >
          Entrar
        </Link>
        <Link href="/(dashboard)" className="rounded-md border border-primary px-4 py-2 text-primary">
          Ver dashboard
        </Link>
      </div>
    </main>
  );
}
