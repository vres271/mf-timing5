# Этап сборки
FROM node:22 as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап запуска
FROM node:22-alpine
WORKDIR /app

# Устанавливаем необходимые зависимости для native модулей
RUN apk add --no-cache python3 make g++

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev && \
    npm rebuild bcrypt --update-binary

COPY --from=build /app/dist ./dist

# Дополнительные инструменты для healthcheck
RUN apk add --no-cache curl

EXPOSE 3000
CMD ["node", "dist/main"]