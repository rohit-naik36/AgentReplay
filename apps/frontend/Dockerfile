FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --config.minimum-release-age=0 --ignore-scripts

COPY . .

EXPOSE 3000

CMD ["pnpm", "next", "dev", "-H", "0.0.0.0"]