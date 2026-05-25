# backend/Dockerfile

FROM node:20-bookworm-slim AS base
WORKDIR /app

# Prisma's Linux engines need the system OpenSSL libraries available at runtime.
RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

# Stage 1: build
FROM base AS builder
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Stage 2: production
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/prisma ./prisma
EXPOSE 3000
CMD ["npm", "start"]
