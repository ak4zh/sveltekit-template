FROM node:18.18.0-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml .
COPY project.inlang/ ./project.inlang

RUN npm i -g pnpm && pnpm i
COPY . .

ARG IS_DOCKER \
	DATABASE_URL \
	# email variables
	FROM_EMAIL \
	SMTP_PASS \
	SMTP_PORT \
	SMTP_HOST \
	SMTP_USER \
	SMTP_SECURE \
	# app specific values
	PUBLIC_DOMAIN \
	PUBLIC_EMAIL

ENV IS_DOCKER=$IS_DOCKER \
	DATABASE_URL=$DATABASE_URL \
	FROM_EMAIL=$FROM_EMAIL \
	SMTP_PASS=$SMTP_PASS \
	SMTP_PORT=$SMTP_PORT \
	SMTP_HOST=$SMTP_HOST \
	SMTP_USER=$SMTP_USER \
	SMTP_SECURE=$SMTP_SECURE \
	PUBLIC_DOMAIN=$PUBLIC_DOMAIN \
	PUBLIC_EMAIL=$PUBLIC_EMAIL

RUN pnpm build

EXPOSE 3000

ENV NODE_ENV=production

CMD [ "node", "build" ]