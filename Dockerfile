FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
# TODO: it fails with --force because 
# many libraries currently don't support svelte 5
RUN npm i --force
COPY . .

ARG DATABASE_URL \
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

ENV DATABASE_URL=$DATABASE_URL \
	FROM_EMAIL=$FROM_EMAIL \
	SMTP_PASS=$SMTP_PASS \
	SMTP_PORT=$SMTP_PORT \
	SMTP_HOST=$SMTP_HOST \
	SMTP_USER=$SMTP_USER \
	SMTP_SECURE=$SMTP_SECURE \
	PUBLIC_DOMAIN=$PUBLIC_DOMAIN \
	PUBLIC_EMAIL=$PUBLIC_EMAIL

RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]