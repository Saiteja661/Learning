# backend/Dockerfile

# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Stage 2: production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/prisma ./prisma
EXPOSE 3000
CMD ["node", "src/index.js"]
