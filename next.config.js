// // // /** @type {import('next').NextConfig} */
// // // const nextConfig = {
    
// // //   webpack: (config, { isServer }) => {
// // //     if (!isServer) {
// // //       config.resolve.fallback = {
// // //         fs: false,
// // //       };
// // //     }
// // //     return config;
// // //   },
// // // };

// // // module.exports = nextConfig;








// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   images: {
// //     remotePatterns: [
// //       {
// //         protocol: 'https',
// //         hostname: 'via.placeholder.com',
// //       },
// //       {
// //         protocol: 'https',
// //         hostname: 'images.unsplash.com', // Agar aap Unsplash images bhi use karte hain
// //       },
// //     ],
// //   },
// //   webpack: (config, { isServer }) => {
// //     if (!isServer) {
// //       config.resolve.fallback = {
// //         fs: false,
// //       };
// //     }
// //     return config;
// //   },
// // };

// // module.exports = nextConfig;











// /** @type {import('next').NextConfig} */
// const nextConfig = {
//    turbopack: {},
//    experimental: {
//     serverActions: {
//       bodySizeLimit: '10mb',  // allow image uploads up to 10 MB
//     },
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'via.placeholder.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//       // 👇 Add your Supabase Storage hostname
//       {
//         protocol: 'https',
//         hostname: 'eeajrfevqexxmofpstbe.supabase.co',
//         port: '',
//         pathname: '/storage/v1/object/public/**',
//       },
//     ],
//   },
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.resolve.fallback = {
//         fs: false,
//       };
//     }
//     return config;
//   },
// };

// module.exports = nextConfig;





/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  images: {
    // Modern formats served by Next.js Image Optimization.
    formats: ['image/avif', 'image/webp'],

    // Uploaded files use unique names and are never overwritten,
    // so optimized versions can safely stay cached.
    minimumCacheTTL: 31536000,

    deviceSizes: [
      360,
      480,
      640,
      750,
      828,
      1080,
      1200,
      1440,
      1920,
    ],

    imageSizes: [
      32,
      48,
      64,
      96,
      128,
      256,
      384,
    ],

    qualities: [60, 70, 75, 80, 85, 90],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname:
          'eeajrfevqexxmofpstbe.supabase.co',
        port: '',
        pathname:
          '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname:
          'eeajrfevqexxmofpstbe.supabase.co',
        port: '',
        pathname:
          '/storage/v1/render/image/public/**',
      },
    ],
  },
}

module.exports = nextConfig
