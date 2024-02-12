FROM node:20.11.0-bullseye

WORKDIR /server

COPY package*.json /server/

RUN npm install

COPY . /server/

EXPOSE 3000

CMD [ "npm", "run", "serve"]