FROM node:18-alpine3.17 as build
WORKDIR /app
COPY . /app
RUN npm i
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /var/www/html/ui
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 5173
CMD ["nginx","-g","daemon off;"]
