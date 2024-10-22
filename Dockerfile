# Usa una imagen base de PHP
FROM php:8.1-cli

# Instala las extensiones necesarias
RUN apt-get update && apt-get install -y \
    libpcre3-dev \
    && pecl install swoole \
    && docker-php-ext-enable swoole

# Copia tu código fuente al contenedor
COPY . /app
WORKDIR /app

# Instala Composer
RUN curl -sSL https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instala las dependencias de Composer
RUN composer install

# Comando de inicio
CMD ["php", "-S", "0.0.0.0:8080", "-t", "public"]
