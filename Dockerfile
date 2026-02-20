FROM node:22-alpine as build
WORKDIR /app
COPY . /app
RUN npm ci

# Generate SBOM
ARG GITHUB_SHA
RUN mkdir -p sbom && \
    npx @cyclonedx/cyclonedx-npm@4.1.2 --output-file sbom/${GITHUB_SHA}.json

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /var/www/html/ui

# Embed SBOM
COPY --from=build /app/sbom /sbom

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 5173

VOLUME ["/var/cache/nginx", "/var/run"]

CMD ["nginx","-g","daemon off;"]
