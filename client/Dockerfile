FROM node:20.11.0-bullseye AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY ./ .

RUN npm run build

FROM nginx:stable-alpine AS production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app

COPY nginx.conf /etc/nginx/nginx.conf
