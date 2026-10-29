import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Metadata direct in de head voor previews, eenvoudige crawlers en toegankelijkheidstools.
  htmlLimitedBots: /.*/,
  experimental: { serverActions: { bodySizeLimit: '12mb' } },
  output: 'standalone',
  serverExternalPackages: ['better-sqlite3'],
  async redirects(){return [{source:'/projecten/the-move-maker',destination:'/projecten',permanent:true},{source:'/maatwerk-software-apeldoorn',destination:'/softwarebedrijf-apeldoorn',permanent:true},{source:'/:path*',has:[{type:'host',value:'www.nimagodigital.nl'}],destination:'https://nimagodigital.nl/:path*',permanent:true},{source:'/:path*',has:[{type:'host',value:'nimago.85.190.105.138.nip.io'}],destination:'https://nimagodigital.nl/:path*',permanent:true}]},
  async headers(){return [{source:'/admin/:path*',headers:[{key:'X-Robots-Tag',value:'noindex, nofollow'},{key:'Cache-Control',value:'no-store'}]},{source:'/:path*',headers:[{key:'X-Content-Type-Options',value:'nosniff'},{key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},{key:'X-Frame-Options',value:'SAMEORIGIN'},{key:'Strict-Transport-Security',value:'max-age=31536000'},{key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}]}]},
};
export default nextConfig;
