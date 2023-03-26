FROM --platform=$BUILDPLATFORM node:18-alpine as base

ENV NODE_ENV=production
ENV BASE_PATH=/ll
RUN yarn global add pnpm

FROM --platform=$BUILDPLATFORM base as deps

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY prisma/schema.prisma ./prisma/
RUN pnpm i --frozen-lockfile

FROM --platform=$BUILDPLATFORM base as builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:18-alpine as runtime

ENV NODE_ENV=production
ENV BASE_PATH=/ll
RUN yarn global add pnpm
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 nextjs

FROM runtime as runner

WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLE=1
CMD ["node", "server.js"]

FROM runtime as managetools

WORKDIR /app
USER nextjs
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/prisma/schema.prisma ./prisma/schema.prisma
RUN pnpm i prisma @prisma/client

ENTRYPOINT ["pnpm"]
