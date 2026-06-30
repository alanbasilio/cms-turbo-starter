import type { Core } from '@strapi/strapi';

// Read actions on Article that should be reachable without manual admin setup,
// so the starter works end-to-end on first run.
const ARTICLE_READ_ACTIONS = [
  'api::article.article.find',
  'api::article.article.findOne',
];

// Demo content created on first boot so the starter shows data immediately.
const SEED_ARTICLES = [
  {
    title: 'Bem-vindo ao CMS Turbo Starter',
    slug: 'bem-vindo-ao-cms-turbo-starter',
    excerpt: 'Um starter Turborepo com Next.js, Strapi e cliente de API tipado.',
    content:
      'Este artigo de exemplo é servido pelo Strapi e renderizado no app Next.js através de hooks React Query gerados pelo kubb.',
  },
  {
    title: 'Como a pipeline de tipos funciona',
    slug: 'como-a-pipeline-de-tipos-funciona',
    excerpt: 'Do modelo no Strapi até a página tipada, sem escrever tipos à mão.',
    content:
      'O Strapi expõe um documento OpenAPI; o kubb gera tipos, schemas zod e hooks React Query a partir dele. Alterou o modelo? Rode `npm run generate` e a UI ganha os tipos novos.',
  },
];

/** Seeds the example articles once, if the collection is empty. */
async function seedArticles(strapi: Core.Strapi) {
  const count = await strapi.documents('api::article.article').count({});
  if (count > 0) return;

  for (const article of SEED_ARTICLES) {
    await strapi
      .documents('api::article.article')
      .create({ data: article, status: 'published' });
  }
}

/** Idempotently enable the given permission actions for a users-permissions role. */
async function enablePermissions(
  strapi: Core.Strapi,
  roleType: 'public' | 'authenticated',
  actions: string[],
) {
  const role = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: roleType } });
  if (!role) return;

  for (const action of actions) {
    const existing = await strapi
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: role.id } });

    if (!existing) {
      await strapi
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: role.id, enabled: true } });
    } else if (!existing.enabled) {
      await strapi
        .query('plugin::users-permissions.permission')
        .update({ where: { id: existing.id }, data: { enabled: true } });
    }
  }
}

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started. Grants public/authenticated read access to
   * the example Article type so the starter works without manual admin clicks.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enablePermissions(strapi, 'public', ARTICLE_READ_ACTIONS);
    await enablePermissions(strapi, 'authenticated', ARTICLE_READ_ACTIONS);
    await seedArticles(strapi);
  },
};
