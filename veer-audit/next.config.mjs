/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow the /embed route to be iframed on your marketing site + coming-soon page.
  async headers() {
    return [
      {
        source: '/embed',
        headers: [
          // Loosen framing so the widget can be embedded. Lock this down to your
          // real domains once you know them (see README "Embedding").
          { key: 'Content-Security-Policy', value: 'frame-ancestors *;' },
        ],
      },
    ];
  },
};

export default nextConfig;
