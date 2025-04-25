# Usa uma imagem base do Node.js
FROM node:18

# Cria um diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package*.json ./
COPY . .

# Instala as dependências
RUN npm install

# Expõe a porta que o app vai usar (ajuste se necessário)
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]