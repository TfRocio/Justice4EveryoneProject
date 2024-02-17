/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/responseChatbot',
            destination: 'https://chatbothatbotprod-2bwmhayk7q-ew.a.run.app/responseChatbot', // 
          },
          {
            source: '/test',
            destination: 'https://chatbothatbotprod-2bwmhayk7q-ew.a.run.app', // 
          },
        ]
      }
};
  

export default nextConfig;
