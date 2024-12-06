/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'vgdotsxnizogfuulhfoo.supabase.co', // โดเมนจาก Supabase
      'img.clerk.com', // เพิ่มโดเมนใหม่ที่จำเป็น
    ],
  },
};

export default nextConfig;