/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/questions",
        permanent: true, // Use true for 301 redirect, false for 302
      },
    ];
  },
};

export default nextConfig;
