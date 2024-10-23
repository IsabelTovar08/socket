# Usa una imagen base de PHP
FROM php:8.1-cli

# Instala las extensiones necesarias (ajusta según lo que necesites)
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd

# Copia los archivos de tu proyecto al contenedor
COPY . /app

# Establece el directorio de trabajo
WORKDIR /app

# Instala Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Instala las dependencias de PHP
RUN composer install

# Exponer el puerto donde escucha el servidor WebSocket
EXPOSE 8080

# Comando de inicio
CMD ["php", "server/server.php"]
