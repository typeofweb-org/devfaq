FROM node:18-bullseye-slim AS builder
RUN apt-get update; apt install -y openssl
RUN npm install -g pnpm@7.14.0

RUN mkdir /app
WORKDIR /app

COPY . .

RUN pnpm --filter=api... i --frozen-lockfile

ENV NODE_ENV production
RUN pnpm --filter=api... build

LABEL fly_launch_runtime="nodejs"

ENV PORT 3000
CMD [ "pnpm", "--filter=api", "run", "start" ]
