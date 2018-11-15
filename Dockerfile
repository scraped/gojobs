FROM node:10.12

WORKDIR /usr/src/app

# For caching
COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "app"]
