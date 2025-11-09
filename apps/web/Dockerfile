FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
COPY tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN npm install --legacy-peer-deps
RUN npm install --workspace apps/web --legacy-peer-deps
RUN npm run build --workspace apps/web

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start", "--workspace", "apps/web"]
