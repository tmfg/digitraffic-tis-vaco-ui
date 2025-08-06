FROM node:22-alpine as build
WORKDIR /app
COPY . /app
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /var/www/html/ui
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 5173
CMD ["nginx","-g","daemon off;"]
