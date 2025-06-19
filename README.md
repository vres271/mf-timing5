# My App

## Описание
Это веб-приложение с фронтендом на Angular, бэкендом на NestJS и базой данных PostgreSQL.

## Генерация секретного ключа
```bash
   openssl rand -base64 32 > secrets/jwt_secret.key
```

## Для генерации самоподписанных SSL-сертификатов на Windows 10:

### 2. **Генерация самоподписанного сертификата**
1. Откройте командную строку (cmd) или PowerShell.
2. Перейдите в папку, где вы хотите сохранить сертификаты:
   ```bash
   cd secrets
   ```
3. Сгенерируйте приватный ключ:
   ```bash
   openssl genpkey -algorithm RSA -out ssl_private.key -aes256
   ```
   - Вам будет предложено ввести пароль для защиты ключа. Если пароль не нужен, удалите флаг `-aes256`.

4. Сгенерируйте запрос на подпись сертификата (CSR):
   ```bash
   openssl req -new -key ssl_private.key -out ssl_certificate.csr
   ```
   - Вам будет предложено ввести информацию о сертификате (страна, организация, доменное имя и т.д.).

5. Сгенерируйте самоподписанный сертификат:
   ```bash
   openssl x509 -req -days 365 -in ssl_certificate.csr -signkey ssl_private.key -out ssl_certificate.crt
   ```
   - Параметр `-days 365` задаёт срок действия сертификата (1 год).

---

### 3. **Итоговые файлы**
После выполнения команд у вас будут созданы следующие файлы:
- `ssl_private.key` — приватный ключ.
- `ssl_certificate.crt` — самоподписанный сертификат.

---

### 4. **Использование сертификатов в Nginx**
Скопируйте файлы `ssl_private.key` и `ssl_certificate.crt` в папку `/secrets` вашего проекта и настройте `docker-compose.yml`, как описано в предыдущем ответе.

---

### 5. **Дополнительно: Удаление пароля из приватного ключа**
Если вы использовали пароль для защиты приватного ключа, его можно удалить:
```bash
openssl rsa -in ssl_private.key -out ssl_private_unencrypted.key
```

---

### 6. **Проверка сертификата**
Вы можете проверить содержимое сертификата с помощью команды:
```bash
openssl x509 -in ssl_certificate.crt -text -noout
```

## Запуск
1. Установите Docker и Docker Compose.
2. Склонируйте репозиторий.
3. Создайте файл `.env` и заполните его (см. `.env.example`).
4. Запустите проект:
   ```bash
   docker-compose up --build

## Адрес фронта

https://localhost:8080


## Деплой

### 1. **Права на `secrets`**

После деплоя убедитесь, что файл секрета `jwt_secret.key` в директории secrets на сервере имеет права доступа 644 (чтение для всех).

Это необходимо для корректной работы проверки токенов через Nginx и lua-resty-jwt.

Если права выставляются автоматически через CI/CD, всё равно рекомендуется проверить их вручную при первом деплое или при изменении инфраструктуры:

```bash
ls -l /home/deploy/app/mft5/secrets/jwt_secret.key
```

При необходимости установите права:

```bash
chmod 644 /home/deploy/app/mft5/secrets/jwt_secret.key
```
Без правильных прав файл может быть недоступен для чтения внутри контейнера, что приведёт к ошибке 500 при обращении к API

### 2. **Структура файлов**

Пример файловой структуры проекта на сервере:

```
/home/deploy/app/mft5
├── docker-compose.prod.yml
├── .env
├── nginx/
│   └── nginx.conf
└── secrets/
    ├── jwt_secret.key
    ├── ssl_certificate.crt
    └── ssl_private.key
```


**Описание:**

- `docker-compose.prod.yml` — основной файл конфигурации Docker Compose для продакшн-среды.
- `.env` — файл переменных окружения.
- `nginx/nginx.conf` — конфигурация Nginx.
- `secrets/` — директория для секретных файлов:
    - `jwt_secret.key` — секретный ключ для JWT.
    - `ssl_certificate.crt` — SSL сертификат.
    - `ssl_private.key` — приватный ключ SSL.


### 3. **Workflow для GitHub Actions**

- `build-push-registry.yml` - Собирает новые Docker-образы для backend, frontend и nginx, а затем пушит их в GitHub Container Registry (GHCR). Ваши изменения попадут в новый Docker-образ и будут загружены в реестр.

- `deploy-registry.yml` - Не собирает и не пушит образы, а только деплоит уже собранные образы на сервер. Сервер скачает (pull) свежий образ из реестра и запустит его.