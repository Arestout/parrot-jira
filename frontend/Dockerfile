# Base
FROM node:14.15.4-alpine3.12 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run build

# Release
# FROM node:14.15.4-alpine3.12 AS release
# WORKDIR /app
# RUN npm install -g serve
# COPY --from=base /app/dist ./dist

FROM nginx:1.19.6-alpine AS release
COPY --from=base /app/dist /usr/share/nginx/html


