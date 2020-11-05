##########################################################
FROM node:14-alpine as prod-deps
##########################################################

WORKDIR /app
COPY ./package*.json ./

RUN npm ci --production --ignore-scripts

##########################################################
FROM node:14-alpine as dev-deps
##########################################################

WORKDIR /app

COPY ./package*.json ./

RUN npm ci --unsafe-perm

##########################################################
FROM node:14-alpine as build
##########################################################

WORKDIR /app
COPY --from=dev-deps /app /app

COPY ./libs/engine ./libs/engine
COPY ./apps/api ./apps/api

COPY nx.json workspace.json tsconfig.base.json ./

RUN npm run build api -- --prod

##########################################################
FROM node:14-alpine as app
##########################################################


WORKDIR /app
COPY --from=prod-deps /app ./
COPY --from=build /app/dist/apps/api ./

CMD node main.js
