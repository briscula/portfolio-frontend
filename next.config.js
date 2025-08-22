/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Disable the sync dynamic APIs warning for Auth0 compatibility
    dynamicIO: false,
  },
}

module.exports = nextConfig