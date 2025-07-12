# Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY ./package.json ./package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage with NGINX
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Opening the port
EXPOSE 80

#Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
