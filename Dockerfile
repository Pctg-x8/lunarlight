FROM --platform=$BUILDPLATFORM node:18-alpine as base

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=/ll
RUN yarn global add pnpm

FROM --platform=$BUILDPLATFORM base as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN pnpm i --frozen-lockfile && pnpm build

FROM node:18-alpine as runtime

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=/ll
RUN yarn global add pnpm

FROM runtime as runner

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
RUN pnpx prisma generate

EXPOSE 3000
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLE=1
CMD ["node", "server.js"]

FROM runtime as managetools

WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
COPY ./prisma ./prisma
RUN pnpm i prisma @prisma/client

ENTRYPOINT ["pnpm"]
