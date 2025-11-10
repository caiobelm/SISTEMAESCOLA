FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
COPY prisma ./prisma
RUN npm install --legacy-peer-deps
RUN npm install --workspace apps/api --legacy-peer-deps
RUN npm run build --workspace apps/api

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3333
CMD ["node", "apps/api/dist/main.js"]
