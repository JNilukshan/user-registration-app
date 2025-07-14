FROM node:18-slim

WORKDIR /app

COPY . .

RUN npm install --omit=dev

EXPOSE 5000

CMD ["node", "server.js"]
