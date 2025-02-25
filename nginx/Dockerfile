FROM openresty/openresty:latest

# Установка зависимостей для обновления luarocks
RUN apt-get update && apt-get install -y \
    git \
    wget \
    unzip \
    build-essential \
    libssl-dev

# Установка последней версии luarocks
RUN wget https://luarocks.org/releases/luarocks-3.9.2.tar.gz && \
    tar -xzf luarocks-3.9.2.tar.gz && \
    cd luarocks-3.9.2 && \
    ./configure && \
    make && \
    make install

# Установка lua-resty-jwt через luarocks
RUN luarocks install lua-resty-jwt

# Копирование конфигурации Nginx
# COPY nginx.conf /usr/local/openresty/nginx/conf/nginx.conf

# Открытие порта 80
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]