/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Wajib untuk export statis ke Hostinger
  images: {
    unoptimized: true, // Wajib ditambahkan jika kamu menggunakan komponen <Image /> dari Next.js
  },
  turbopack: {},
};

module.exports = nextConfig;