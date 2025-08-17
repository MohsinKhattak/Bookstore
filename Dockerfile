# Stage 1: Base dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json nx.json tsconfig.base.json ./
COPY packages/api/package*.json packages/api/
COPY packages/ui/package*.json packages/ui/
COPY shared-types/package*.json shared-types/
RUN npm install --legacy-peer-deps

# Stage 2: Build API
FROM deps AS api-builder
COPY . .
RUN npx nx build api

# Stage 3: Build UI
FROM deps AS ui-builder
COPY . .
RUN npx nx build ui

# Stage 4: Run API
FROM node:20-alpine AS api
WORKDIR /app
COPY package*.json ./
COPY packages/api/package*.json packages/api/
RUN npm install --omit=dev --legacy-peer-deps
COPY --from=api-builder /app/dist/packages/api ./
EXPOSE 3000
CMD ["node", "main.js"]


# Stage 5: Run UI
FROM nginx:alpine AS ui
COPY --from=ui-builder /app/dist/packages/ui /usr/share/nginx/html
