FROM openresty/openresty:latest

RUN apt-get update && apt-get install -y \
    wget unzip build-essential libssl-dev

# Установка lua-resty-hmac
RUN wget https://github.com/jkeys089/lua-resty-hmac/archive/master.tar.gz -O /tmp/lua-resty-hmac.tar.gz \
    && tar -xzf /tmp/lua-resty-hmac.tar.gz -C /tmp \
    && mv /tmp/lua-resty-hmac-master /tmp/lua-resty-hmac \
    && cp /tmp/lua-resty-hmac/lib/resty/hmac.lua /usr/local/openresty/lualib/resty/ \
    && rm -rf /tmp/lua-resty-hmac*

# Установка lua-resty-jwt
RUN wget https://github.com/SkyLothar/lua-resty-jwt/archive/master.tar.gz -O /tmp/lua-resty-jwt.tar.gz \
    && tar -xzf /tmp/lua-resty-jwt.tar.gz -C /tmp \
    && mv /tmp/lua-resty-jwt-master /tmp/lua-resty-jwt \
    && cp /tmp/lua-resty-jwt/lib/resty/*.lua /usr/local/openresty/lualib/resty/ \
    && rm -rf /tmp/lua-resty-jwt*

# Установка lua-resty-redis
RUN wget https://github.com/openresty/lua-resty-redis/archive/master.tar.gz -O /tmp/lua-resty-redis.tar.gz \
    && tar -xzf /tmp/lua-resty-redis.tar.gz -C /tmp \
    && mv /tmp/lua-resty-redis-master /tmp/lua-resty-redis \
    && cp /tmp/lua-resty-redis/lib/resty/redis.lua /usr/local/openresty/lualib/resty/ \
    && rm -rf /tmp/lua-resty-redis*

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
