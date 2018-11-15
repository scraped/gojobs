FROM node:10.12

WORKDIR /usr/src/app

RUN npm i -g nodemon

COPY package*.json ./

RUN npm i

COPY . .

CMD ["nodemon", "app"]
