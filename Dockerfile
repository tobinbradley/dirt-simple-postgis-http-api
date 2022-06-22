# adapted from https://nodejs.org/en/docs/guides/nodejs-docker-webapp/
FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm ci --only=production
COPY . .
RUN mv ./config/index.json.txt ./config/index.json
EXPOSE 3000
CMD [ "npm", "run", "start" ]
