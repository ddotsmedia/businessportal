/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
};

export default nextConfig;
