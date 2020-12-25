FROM node:12-alpine

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV NODE_SERVER_PORT 80
EXPOSE 80

HEALTHCHECK --interval=1m --timeout=5s --start-period=5s --retries=3 \
	CMD curl -f -s -o /dev/null http://localhost/ping || exit 1

RUN apk add exiftool imagemagick git;

WORKDIR /srv

COPY package*.json ./
RUN echo $NODE_ENV; npm install --production;

COPY . ./
RUN npm run build;

ENTRYPOINT [ "npm", "run", "start" ]
