FROM openresty/openresty:latest

# Установка зависимостей
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    build-essential \
    libssl-dev

# Скачивание и распаковка библиотек
RUN wget https://github.com/SkyLothar/lua-resty-jwt/archive/master.tar.gz -O /tmp/lua-resty-jwt.tar.gz \
    && tar -xzf /tmp/lua-resty-jwt.tar.gz -C /tmp \
    && mv /tmp/lua-resty-jwt-master /tmp/lua-resty-jwt \
    && rm /tmp/lua-resty-jwt.tar.gz

RUN wget https://github.com/openresty/lua-resty-redis/archive/master.tar.gz -O /tmp/lua-resty-redis.tar.gz \
    && tar -xzf /tmp/lua-resty-redis.tar.gz -C /tmp \
    && mv /tmp/lua-resty-redis-master /tmp/lua-resty-redis \
    && rm /tmp/lua-resty-redis.tar.gz

# Копируем файлы библиотек напрямую в lualib
RUN mkdir -p /usr/local/openresty/lualib/resty \
    && cp /tmp/lua-resty-jwt/lib/resty/jwt* /usr/local/openresty/lualib/resty/ \
    && cp /tmp/lua-resty-jwt/lib/resty/evp.lua /usr/local/openresty/lualib/resty/ \  # Исправлено!
    && cp /tmp/lua-resty-redis/lib/resty/redis.lua /usr/local/openresty/lualib/resty/

# Очистка временных файлов
RUN rm -rf /tmp/lua-resty-*

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
