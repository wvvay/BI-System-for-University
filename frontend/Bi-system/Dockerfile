FROM node:18-alpine AS builder

WORKDIR /app

# Устанавливаем необходимые системные зависимости
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    jpeg-dev \
    cairo-dev \
    giflib-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN npm run build

# Создаем production образ с nginx
FROM nginx:stable-alpine

# Копируем собранное приложение
COPY --from=builder /app/.next/static /usr/share/nginx/html/_next/static
COPY --from=builder /app/.next/server/pages /usr/share/nginx/html
COPY --from=builder /app/.next/server/pages-manifest.json /usr/share/nginx/html/
COPY --from=builder /app/.next/server/middleware-manifest.json /usr/share/nginx/html/

# Копируем конфигурацию nginx для фронтенда
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4000

CMD ["nginx", "-g", "daemon off;"]