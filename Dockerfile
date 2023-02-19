FROM node:18-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY . .
RUN yarn global add pnpm && pnpm i --frozen-lockfile && pnpm build

EXPOSE 3000
ENV PORT=3000
CMD ["pnpm", "start"]
