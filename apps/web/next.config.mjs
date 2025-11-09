import { brandTheme } from '@sistemaescola/ui';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@sistemaescola/ui'],
  env: {
    NEXT_PUBLIC_BRAND_PRIMARY: brandTheme.colors.primary
  }
};

export default nextConfig;
