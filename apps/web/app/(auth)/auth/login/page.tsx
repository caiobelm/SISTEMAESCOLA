'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { Button, Card } from '@sistemaescola/ui';

const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  password: z.string().min(6, 'Senha inválida')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setMessage(null);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'}/auth/login`,
        data,
        { withCredentials: true }
      );
      setMessage(`Bem-vindo, ${response.data.user.name}`);
    } catch (error: any) {
      setMessage(error?.response?.data?.message ?? 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 p-4">
      <Card
        className="w-full max-w-md"
        title={`Portal ${process.env.NOME_DA_ESCOLA ?? '{{NOME_DA_ESCOLA}}'}`}
        description="Acesse sua conta para gerenciar biblioteca, presença e avisos"
      >
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:border-primary focus:outline-none"
              {...register('email')}
            />
            {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:border-primary focus:outline-none"
              {...register('password')}
            />
            {errors.password && <span className="text-xs text-red-500">{errors.password.message}</span>}
          </div>
          <Button type="submit" className="w-full" isLoading={loading}>
            Entrar
          </Button>
        </form>
        <div className="mt-4 text-center text-sm text-slate-500">
          <a className="text-primary hover:underline" href="/auth/forgot">
            Esqueci minha senha
          </a>
        </div>
        {message && <p className="mt-4 rounded-md bg-slate-100 p-2 text-center text-sm text-slate-600">{message}</p>}
      </Card>
    </div>
  );
}
