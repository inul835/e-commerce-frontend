import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // এর মানে হলো https-এর যেকোনো ডোমেইনের ইমেজ কাজ করবে
      },
      {
        protocol: 'http',
        hostname: '**', // অনেক সময় কিছু সাইট http ব্যবহার করে, তাই এটাও সেফটি হিসেবে দিয়ে রাখলাম
      },
    ],
  },
};

export default nextConfig;