FROM node:18-bullseye-slim as builder-base

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=/ll
ENV NEXT_PUBLIC_WS_SERVER_URL=wss://crescent.ct2.io/ll/streaming
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN yarn global add pnpm && pnpm i --frozen-lockfile

FROM node:18-bullseye-slim as runtime

ENV NODE_ENV=production
ENV NEXT_PUBLIC_BASE_PATH=/ll
RUN yarn global add pnpm

## app

FROM --platform=$BUILDPLATFORM builder-base as builder

WORKDIR /app
COPY . .
RUN pnpm db:generate-client && pnpm build

FROM runtime as runner

WORKDIR /app
COPY --from=builder /app/package.json /app/next.config.js ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
RUN pnpm db:generate-client

EXPOSE 3000
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLE=1
CMD ["pnpm", "start"]

## managetools

FROM runtime as managetools

WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
RUN pnpm db:generate-client

ENTRYPOINT ["pnpm"]

## streamer

FROM --platform=$BUILDPLATFORM builder-base as streamer-builder

ENV WS_PORT=3001
WORKDIR /app
COPY . .
RUN pnpm db:generate-client && pnpm build:ws

FROM runtime as streamer

WORKDIR /app
COPY package.json ./
COPY --from=streamer-builder /app/dist/streamingServer.js ./
COPY ./prisma/schema.prisma ./prisma/
COPY --from=streamer-builder /app/node_modules ./node_modules
RUN pnpm db:generate-client

ENTRYPOINT ["node", "./streamingServer.js"]
