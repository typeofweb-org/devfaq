FROM node:12-alpine
WORKDIR /app

#copy all the app files
COPY . .

RUN yarn install
RUN yarn run build

CMD NODE_ENV=production yarn start
