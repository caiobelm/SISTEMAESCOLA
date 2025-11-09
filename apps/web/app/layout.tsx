import './globals.css';
import { ReactNode } from 'react';
import { brandTheme } from '@sistemaescola/ui';

export const metadata = {
  title: '{{NOME_DA_ESCOLA}} Portal Escolar',
  description: 'Sistema integrado de gestão escolar, biblioteca e presenças',
  icons: [{ rel: 'icon', url: '{{LOGO_URL}}' }]
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-slate-50">
        <div className="min-h-screen" style={{ borderTop: `4px solid ${brandTheme.colors.primary}` }}>
          {children}
        </div>
      </body>
    </html>
  );
}
