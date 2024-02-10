FROM node:lts-alpine

WORKDIR /server

COPY package*.json /server/

RUN npm install

COPY . /server/

EXPOSE 3000

CMD [ "npm", "run", "serve"]