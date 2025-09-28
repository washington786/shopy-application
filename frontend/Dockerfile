FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npx ng build --configuration=production --output-path=dist/frontend

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf


COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
