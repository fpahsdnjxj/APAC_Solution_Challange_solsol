FROM node:22-alpine AS build

WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 실제 서비스 컨테이너
FROM nginx:alpine
COPY --from=build /src/build /usr/share/nginx/html
