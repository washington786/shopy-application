# Build stage
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./

# Configure yarn for better network handling
RUN yarn config set network-timeout 600000 && \
    yarn config set network-concurrency 1

# Install dependencies with yarn
RUN yarn install --network-timeout 600000 --verbose

COPY . .

# Build Angular app
RUN npx ng build --configuration=production --output-path=dist/frontend

# Serve with Nginx
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy Angular build
COPY --from=build /app/dist/frontend /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
