/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "cdn.pixabay.com",
      "www.letifly.com",
      "www.sundays-company.com",
      "assets.pbimgs.com",
      "images.fineartamerica.com",
      "render.fineartamerica.com",
    ], // Add cdn.pixabay.com to the list of allowed image domains
  },
  // Any other configuration options here
};

export default nextConfig;
