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

RUN useradd -u 1000 -r -s /bin/false runsabba && \ 
 chown -R runsabba:runsabba /app

USER runsabba

EXPOSE 3000

CMD ["node", "dist/app.js"]



