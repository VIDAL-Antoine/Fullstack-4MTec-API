FROM node:20.11.0-bullseye

WORKDIR /server

COPY package*.json /server/

RUN npm install --omit=dev

COPY . /server/

RUN npm run build

CMD [ "npm", "start"]
