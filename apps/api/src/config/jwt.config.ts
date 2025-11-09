export const jwtConstants = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  accessTtl: '15m',
  refreshTtl: '7d'
};
