FROM node:24.22.1-alpine3.24@sha256:06d7adf3e0ef61a13f1d28682726366f97a15aa1888c934d3ecec86c33918b53 AS build
WORKDIR /app
COPY . /app
RUN npm ci

# Generate SBOM
ARG GITHUB_SHA
RUN mkdir -p sbom && GITHUB_SHA=${GITHUB_SHA} npm run sbom

RUN npm run build

FROM nginx:1.31.8-alpine3.24@sha256:713fc2ebfd92e8217db451477182ee91944b123d2b1ee9fd5a8c6e91ca6c3a11
COPY --from=build /app/dist /var/www/html/ui

# Embed SBOM
COPY --from=build /app/sbom /sbom

RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
EXPOSE 5173

VOLUME ["/var/cache/nginx", "/var/run"]

CMD ["nginx","-g","daemon off;"]
