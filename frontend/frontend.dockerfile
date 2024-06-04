FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install npm@latest -g

RUN npm install

COPY . .

EXPOSE 3000


CMD ["npm", "run", "dev"]
