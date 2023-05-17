FROM node:lts-alpine

WORKDIR /app

RUN mkdir -p /app/data
VOLUME /app/data

COPY package*.json ./

COPY . .

RUN npm install

CMD [ "npm", "run", "start" ]
