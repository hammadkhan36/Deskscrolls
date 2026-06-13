// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
    
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
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'via.placeholder.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com', // Agar aap Unsplash images bhi use karte hain
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // 👇 Add your Supabase Storage hostname
      {
        protocol: 'https',
        hostname: 'eeajrfevqexxmofpstbe.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;