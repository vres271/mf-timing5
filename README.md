# My App

## Описание
Это веб-приложение с фронтендом на Angular, бэкендом на NestJS и базой данных PostgreSQL.

## Генерация секретного ключа
```bash
   openssl rand -base64 32 > secrets/jwt_secret.key
```

## Запуск
1. Установите Docker и Docker Compose.
2. Склонируйте репозиторий.
3. Создайте файл `.env` и заполните его (см. `.env.example`).
4. Запустите проект:
   ```bash
   docker-compose up --build