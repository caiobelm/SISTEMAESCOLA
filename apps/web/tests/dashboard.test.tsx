import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/(dashboard)/page';

describe('DashboardPage', () => {
  it('exibe cards principais', async () => {
    const Component = await DashboardPage();
    render(Component as any);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Empréstimos ativos')).toBeInTheDocument();
  });
});
