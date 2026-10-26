FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++ libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

FROM node:22-alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS run
WORKDIR /app
RUN apk add --no-cache su-exec && addgroup -S app && adduser -S app -G app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0 DATA_DIR=/data
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
RUN mkdir -p /data && chown app:app /data
# Het volume wordt als root gemount; maak het schrijfbaar voor de app-gebruiker en draai daarna zonder root-rechten.
RUN printf '#!/bin/sh\nmkdir -p "$DATA_DIR"\nchown -R app:app "$DATA_DIR"\nexec su-exec app node server.js\n' > /entrypoint.sh && chmod +x /entrypoint.sh
EXPOSE 3000
VOLUME ["/data"]
ENTRYPOINT ["/entrypoint.sh"]
