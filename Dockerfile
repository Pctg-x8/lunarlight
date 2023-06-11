FROM --platform=$BUILDPLATFORM node:18-alpine as base

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=/ll
ENV NEXT_PUBLIC_WS_SERVER_URL=wss://crescent.ct2.io/ll/streaming
RUN yarn global add pnpm

FROM --platform=$BUILDPLATFORM base as builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY . .
RUN pnpm i --frozen-lockfile && pnpm build

FROM node:18-alpine as runtime

ENV NODE_ENV=production
RUN yarn global add pnpm

FROM runtime as runner

WORKDIR /app
COPY --from=builder /app/package.json /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
RUN pnpx prisma generate

EXPOSE 3000
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLE=1
CMD ["pnpm", "start"]

FROM runtime as managetools

WORKDIR /app
COPY ./package.json ./pnpm-lock.yaml ./
COPY ./prisma ./prisma
RUN pnpm i prisma @prisma/client

ENTRYPOINT ["pnpm"]

FROM --platform=$BUILDPLATFORM base as streamer-builder

ENV WS_PORT=3001
WORKDIR /app
COPY . .
RUN pnpm i --frozen-lockfile && pnpm db:generate-client && pnpm build:ws

FROM runtime as streamer

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY --from=streamer-builder /app/dist/streamingServer.js ./
COPY ./prisma/schema.prisma ./prisma/
RUN pnpm i prisma @prisma/client && pnpm db:generate-client

ENTRYPOINT ["node", "./streamingServer.js"]
