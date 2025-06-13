import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
      typescript: {
    ignoreBuildErrors: true,
  },
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },

};

export default nextConfig;
