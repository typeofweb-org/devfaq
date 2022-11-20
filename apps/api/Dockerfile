FROM node:18-bullseye-slim AS builder
RUN apt-get update; apt install -y openssl
RUN npm install -g pnpm@7.14.0

RUN mkdir /app
WORKDIR /app

COPY . .

RUN pnpm pnpm --filter=api i --frozen-lockfile

ENV NODE_ENV production
RUN pnpm --filter=api build

LABEL fly_launch_runtime="nodejs"

ENV PORT 3000
CMD [ "pnpm", "--filter=api", "run", "start" ]

# FROM node:18-bullseye-slim AS build
# RUN apt-get update
# RUN apt-get install openssl libssl-dev
# WORKDIR /usr/src/devfaq
# RUN npm install -g pnpm
# COPY ../.. /usr/src/devfaq
# RUN pnpm --filter=api i --frozen-lockfile
# RUN pnpm --filter=api build

# FROM gcr.io/distroless/nodejs:18
# COPY --from=build /usr/src/devfaq /usr/src/devfaq
# WORKDIR /usr/src/devfaq
# CMD ["./apps/api/index.js"]