FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install npm@latest -g

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
