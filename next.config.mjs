/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'mitoslearning.in'],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/questions",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
