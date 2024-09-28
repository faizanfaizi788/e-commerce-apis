#Sample Dockerfile for NodeJS Apps

FROM node:20.17.0

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 5000

CMD [ "node", "src/app.js" ]