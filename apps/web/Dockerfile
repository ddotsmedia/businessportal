FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/node_modules/.pnpm/@prisma+client@6.19.3_prisma@6.19.3_typescript@5.9.3__typescript@5.9.3/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node ./prisma-engines/libquery_engine-linux-musl-openssl-3.0.x.so.node

ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/prisma-engines/libquery_engine-linux-musl-openssl-3.0.x.so.node
ENV HOSTNAME=0.0.0.0

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "apps/web/server.js"]
