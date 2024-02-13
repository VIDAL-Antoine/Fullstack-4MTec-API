FROM node:20.11.0-bullseye

WORKDIR /server

COPY package*.json /server/

RUN npm install

COPY . /server/

RUN npm run build

CMD [ "npm", "start"]
