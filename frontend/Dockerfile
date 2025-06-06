# Primera etapa: Construir la aplicación React con Vite
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build 

# Segunda etapa: Servir la aplicación estática con Nginx
FROM nginx:stable-alpine AS production

# Copia los archivos estáticos generados por Vite a la ubicación de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# ----------------------------------------------------------------------
# !!! ESTA LÍNEA ES CRUCIAL: COPIA TU CONFIGURACIÓN DE NGINX PERSONALIZADA !!!
# Asegúrate de que no esté comentada y que la ruta sea correcta.
# ----------------------------------------------------------------------
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 

CMD ["nginx", "-g", "daemon off;"]