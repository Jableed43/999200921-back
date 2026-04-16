# 1. importamos la imagen base de node, node alpine, ligera y eficiente para produccion
FROM node:alpine

# 2. Definir el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar package.json y package-lock.json
# Optimitar la build ya que solo se reinstalan dependencias si estos archivos cambian
COPY package*.json ./

#4. instalar las dependencias del proyecto
RUN npm install

#5. Copiar todos el resto de archivos del proyecto al contenedor
COPY . .

#6. Exponer el puerto por el que corre la app (debe coincidir con el del codigo)
EXPOSE 3000

#7. definir el comando por defecto para arrancar la aplicacion
CMD ["npm", "start"]