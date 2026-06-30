import type { Core } from '@strapi/strapi';

// Allowed browser origins. The Next.js BFF talks to Strapi server-to-server (not
// subject to CORS), so this only needs to list direct browser clients.
const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',');

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  { name: 'strapi::cors', config: { origin: corsOrigins } },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

export default config;
