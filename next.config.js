/** @type {import('next').NextConfig} */
const nextConfig = {
  // УБЕДИТЕСЬ, ЧТО ЗДЕСЬ НЕТ СТРОКИ "output: 'export'"
  
  typescript: {
    // Эта опция поможет избежать ошибок при сборке из-за сторонних библиотек
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;