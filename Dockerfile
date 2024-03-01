# adapted from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:20-slim
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "start" ]
