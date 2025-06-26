# Этап сборки
FROM node:24.2.0 as build

WORKDIR /app
COPY package.json package-lock.json ./
# флаг --legacy-peer-deps нужен так как используется primeng 19 (который официально не совместим, но вроде работает) с angular 20. Нужно убрать после перехода на своместимые версии
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

# Этап запуска
FROM nginx:1.26-alpine

COPY --from=build /app/dist/mft5-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
