FROM node:18-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm ci --only=production

FROM node:18-slim AS app

WORKDIR /app

COPY --from=build /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/dist ./dist

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --gid 1001 --no-create-home runsabba
 
RUN chown -R runsabba:nodejs /app
##
USER runsabba

EXPOSE 3000

CMD ["node", "dist/app.js"]



