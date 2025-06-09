import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com'
			},
			{
				protocol: 'https',
				hostname: 'avsfbmrrdcusegnqdxaa.supabase.co'
			}
		]
	},
};

export default nextConfig;
