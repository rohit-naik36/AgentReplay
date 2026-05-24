FROM node:22-alpine

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable
RUN corepack prepare pnpm@10.17.0 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts=false

COPY . .

# Run Next.js in development mode, or we can build it. We'll use dev mode for the MVP to allow hot reloading via volume mapping.
EXPOSE 3000
CMD ["pnpm", "dev"]
