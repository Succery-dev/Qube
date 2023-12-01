/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"firebasestorage.googleapis.com", 
			`${process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}.ipfscdn.io`
		],
	},
	env: {
	},
};

module.exports = nextConfig;
