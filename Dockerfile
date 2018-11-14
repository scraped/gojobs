FROM node:10.12

WORKDIR /usr/src/app

COPY . .

RUN npm i

CMD ["node", "app.js"]
