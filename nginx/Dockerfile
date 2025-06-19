FROM openresty/openresty:latest

# Установка зависимостей для обновления luarocks
RUN apt-get update && apt-get install -y \
    git \
    wget \
    unzip \
    build-essential \
    libssl-dev

# Установка последней версии luarocks
# RUN wget https://luarocks.org/releases/luarocks-3.9.2.tar.gz && \
#     tar -xzf luarocks-3.9.2.tar.gz && \
#     cd luarocks-3.9.2 && \
#     ./configure && \
#     make && \
#     make install

# Установка lua-resty-jwt через luarocks
# RUN luarocks install lua-resty-jwt

# Устанавливаем lua-resty-redis
# RUN luarocks install lua-resty-redis

# Клонируем репозитории с библиотеками
RUN git clone https://github.com/SkyLothar/lua-resty-jwt.git /tmp/lua-resty-jwt \
    && git clone https://github.com/openresty/lua-resty-redis.git /tmp/lua-resty-redis

# Копируем файлы библиотек напрямую в lualib
RUN mkdir -p /usr/local/openresty/lualib/resty \
    && cp /tmp/lua-resty-jwt/lib/resty/jwt* /usr/local/openresty/lualib/resty/ \
    && cp /tmp/lua-resty-redis/lib/resty/redis.lua /usr/local/openresty/lualib/resty/

# Очистка временных файлов
RUN rm -rf /tmp/lua-resty-jwt /tmp/lua-resty-redis

# Копирование конфигурации Nginx
# COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Открытие порта 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]