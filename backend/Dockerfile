FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

# Añade un mensaje para ver el inicio de la instalación
RUN echo "Iniciando npm install..." && npm install && echo "npm install terminado."

COPY . .

EXPOSE 5000

# CAMBIA EL CMD TEMPORALMENTE: Mantiene el contenedor vivo para depurar
CMD ["tail", "-f", "/dev/null"]