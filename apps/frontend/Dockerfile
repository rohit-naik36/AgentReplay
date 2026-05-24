FROM node:20-alpine

WORKDIR /app

# Enable corepack for pnpm
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

# Run Next.js in development mode, or we can build it. We'll use dev mode for the MVP to allow hot reloading via volume mapping.
CMD ["pnpm", "dev"]
