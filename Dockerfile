FROM node:8-alpine
WORKDIR /app

#copy all the app files
COPY . .

RUN npm install
RUN npm run build

CMD NODE_ENV=production npm start
