FROM node:8.9.0-alpine
WORKDIR /usr/fefaq

COPY package.json package-lock*.json npm-shrinkwrap*.json ./

RUN apk --no-cache add --virtual native-deps git g++ gcc libgcc libstdc++ linux-headers make python

RUN npm install --build-from-source=bcrypt

COPY . .
