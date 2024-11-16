FROM docker.io/node:lts-alpine AS build

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN rm -rf .nx/cache

RUN npm run build

# builder stage named "deps"
FROM docker.io/node:lts-alpine AS deps

COPY ./package*.json ./

# install extracted deps
RUN npm install --omit=dev --only=production

# runner stage
FROM docker.io/node:lts-alpine AS runner
WORKDIR /app

RUN apk add dumb-init

# pull in packages from builder stage
COPY --from=deps ./node_modules ./node_modules
COPY --from=deps ./package.json ./package.json

# copy local, compiled app
COPY --from=build /app/dist/apps/ .
RUN chown -R node:node .
USER node

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "/app/api/main.js"]
