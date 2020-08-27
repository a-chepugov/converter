FROM node:14

ARG NODE_ENV

ENV NODE_ENV $NODE_ENV

ENV NODE_SERVER_PORT 80

EXPOSE 80

ENTRYPOINT [ "npm", "run", "server:ts:watch" ]

HEALTHCHECK --interval=1m --timeout=3s --retries=3 \
	CMD curl -f -s -o /dev/null http://localhost:80/ping || exit 1

WORKDIR /srv

COPY package*.json ./

RUN echo $NODE_ENV; \
if [ "$NODE_ENV" = "production" ]; \
then \
	npm install; \
else \
	npm install; \
fi;

COPY . ./
