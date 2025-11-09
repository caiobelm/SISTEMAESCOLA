'use client';

import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useState } from 'react';
import { Button, Card } from '@sistemaescola/ui';

export default function ForgotPage() {
  const { register, handleSubmit } = useForm<{ email: string }>();
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async ({ email }: { email: string }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333'}/auth/forgot`,
      { email }
    );
    setMessage(response.data.message);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card title="Recuperar senha" description="Informe seu e-mail para receber instruções.">
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-200 p-2 focus:border-primary focus:outline-none"
              {...register('email')}
            />
          </div>
          <Button type="submit" className="w-full">
            Enviar instruções
          </Button>
        </form>
        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </Card>
    </div>
  );
}
