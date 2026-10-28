import { defineMiddleware } from 'astro:middleware';
import { useI18n } from './i18n';

export const onRequest = defineMiddleware((ctx, next) => {
  ctx.locals.i18n = useI18n(ctx.currentLocale);
  return next();
});